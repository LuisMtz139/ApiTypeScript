import db from '../config/database';

export const getAllCorhorte = async () => {
    const query = `
        SELECT 
            generaciones.generacion,
            COUNT(rezago.cantidad_estudiantes_con_rezago) AS cantidad_estudiantes_con_rezago,
            MIN(titulados.fecha_ingreso) AS fecha_ingreso,
            MAX(titulados.fecha_egreso) AS fecha_egreso
        FROM (
            SELECT DISTINCT LEFT(matricula, 3) AS generacion FROM estudiantes
        ) AS generaciones
        LEFT JOIN (
            SELECT
                LEFT(estudiantes.matricula, 3) AS generacion,
                COUNT(DISTINCT estudiantes.matricula) AS cantidad_estudiantes_con_rezago
            FROM calificaciones
            INNER JOIN asignaturas ON calificaciones.asignatura_id = asignaturas.id
            INNER JOIN estudiantes ON calificaciones.estudiante_id = estudiantes.id
            WHERE LEFT(estudiantes.matricula, 3) IN (SELECT DISTINCT LEFT(matricula, 3) FROM estudiantes)
            AND calificaciones.final < 70
            GROUP BY LEFT(estudiantes.matricula, 3)
        ) AS rezago ON generaciones.generacion = rezago.generacion
        LEFT JOIN (
            SELECT 
                LEFT(e.matricula, 3) AS generacion,
                MIN(p1.anio) AS fecha_ingreso,
                (SELECT MAX(p2.anio)
                 FROM periodos p2
                 JOIN calificaciones c2 ON p2.id = c2.periodo_id
                 JOIN asignaturas a2 ON c2.asignatura_id = a2.id
                 WHERE c2.estudiante_id = e.id
                   AND a2.cuatrimestre = '10'
                 ) AS fecha_egreso
            FROM 
                estudiantes e
            JOIN 
                calificaciones c ON e.id = c.estudiante_id
            JOIN 
                periodos p1 ON c.periodo_id = p1.id
            WHERE 
                LEFT(e.matricula, 3) IN (SELECT DISTINCT LEFT(matricula, 3) FROM estudiantes)
            GROUP BY 
                LEFT(e.matricula, 3), e.id
        ) AS titulados ON generaciones.generacion = titulados.generacion
        WHERE rezago.cantidad_estudiantes_con_rezago > 0
        GROUP BY generaciones.generacion;
    `;

    const [rows] = await db.query(query);
    return rows;
};


export const getCohorteBychorte = async (cohorte: string) => {
    const query = `
    SELECT 
        generaciones.generacion,
        MAX(rezago.cantidad_estudiantes_con_rezago) AS cantidad_estudiantes_con_rezago,
        MIN(titulados.fecha_ingreso) AS fecha_ingreso,
        MAX(titulados.fecha_egreso) AS fecha_egreso,
        MAX(total_generacion.total_estudiantes_generacion) AS total_estudiantes_generacion
    FROM (
        SELECT DISTINCT LEFT(matricula, 3) AS generacion 
        FROM estudiantes
        WHERE LEFT(matricula, 3) = '${cohorte}'
        ) AS generaciones
    LEFT JOIN (
        SELECT
            LEFT(estudiantes.matricula, 3) AS generacion,
            COUNT(DISTINCT estudiantes.matricula) AS cantidad_estudiantes_con_rezago
        FROM calificaciones
            INNER JOIN asignaturas ON calificaciones.asignatura_id = asignaturas.id
            INNER JOIN estudiantes ON calificaciones.estudiante_id = estudiantes.id
        WHERE LEFT(estudiantes.matricula, 3) = '${cohorte}'
            AND calificaciones.final < 70
                GROUP BY LEFT(estudiantes.matricula, 3)
            ) AS rezago ON generaciones.generacion = rezago.generacion
            LEFT JOIN (
                SELECT 
                    LEFT(e.matricula, 3) AS generacion,
                        MIN(p1.anio) AS fecha_ingreso,
                            (SELECT MAX(p2.anio)
                            FROM periodos p2
                            JOIN calificaciones c2 ON p2.id = c2.periodo_id
                            JOIN asignaturas a2 ON c2.asignatura_id = a2.id
                            WHERE c2.estudiante_id = e.id
                            AND a2.cuatrimestre = '10'
                        ) AS fecha_egreso
                        FROM 
                            estudiantes e
                        JOIN 
                            calificaciones c ON e.id = c.estudiante_id
                        JOIN 
                            periodos p1 ON c.periodo_id = p1.id
                        WHERE 
                            LEFT(e.matricula, 3) = '${cohorte}'
                        GROUP BY 
                            LEFT(e.matricula, 3), e.id
                    ) AS titulados ON generaciones.generacion = titulados.generacion
                    LEFT JOIN (
                        SELECT 
                            LEFT(matricula, 3) AS generacion,
                            COUNT(DISTINCT matricula) AS total_estudiantes_generacion
                        FROM 
                            estudiantes
                        WHERE 
                            LEFT(matricula, 3) = '${cohorte}'
                        GROUP BY 
                            LEFT(matricula, 3)
                    ) AS total_generacion ON generaciones.generacion = total_generacion.generacion
                    WHERE rezago.cantidad_estudiantes_con_rezago > 0
                    GROUP BY generaciones.generacion;
    `;
    const [rows] = await db.query(query);
    return rows;
}


export const obtener_infromacion_general = async(cohorte: string)=>{
    const query = `
        SELECT
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%') AS total_estudiantes,
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%' AND estatus = 'Inscrito') AS inscritos,
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%' AND estatus = 'Baja Definitiva') AS bajas_definitivas,
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%' AND estatus = 'Baja Académica') AS bajas_academicas,
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%' AND estatus = 'Titulado') AS titulados,
            (SELECT COUNT(*) FROM estudiantes WHERE matricula LIKE '${cohorte}%' AND estatus = 'Egresado') AS Egresado,
            SUM(CASE WHEN tiene_materias_reprobatorias = 'Sí' THEN 1 ELSE 0 END) AS Cantidad_de_Estudiantes_en_rezago,
            SUM(CASE WHEN tiene_materias_reprobatorias = 'No' THEN 1 ELSE 0 END) AS Estudiantes_ordinarios,
            0 AS M,
            0 AS F
        FROM (
            SELECT 
                e.id,
                e.estatus,
                CASE 
                    WHEN EXISTS (
                        SELECT 1
                        FROM calificaciones c
                        WHERE c.estudiante_id = e.id
                        AND (
                            (c.final IS NOT NULL AND c.final < 70 AND (c.extra IS NULL OR c.extra < 70))
                            OR
                            (c.extra IS NOT NULL AND c.extra < 70 AND c.final < 70)
                        )
                        AND NOT (c.final <= 0 AND c.extra <= 0)
                    ) THEN 'Sí'
                    ELSE 'No'
                END AS tiene_materias_reprobatorias
            FROM 
                estudiantes e
            WHERE 
                e.matricula LIKE '${cohorte}%'
        ) AS resultados;

    `;

    const [rows] = await db.query(query);
    return rows;

}
