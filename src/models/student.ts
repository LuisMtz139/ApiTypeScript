import { QueryResult } from 'mysql2';
import db from '../config/database';



export async function getStudentByGeneration(generation: string, limit: number, offset: number) {
    const query = `
    
    SELECT
    e.matricula AS student_code,
    e.estatus AS status,
    e.cuatrimestre_actual AS grade,
    COALESCE(p.nombre, 'Nombre no disponible') AS name,
    (
        (SELECT COUNT(*) 
         FROM asignaturas 
         WHERE cuatrimestre <= e.cuatrimestre_actual) -
        (SELECT COUNT(*) 
         FROM asignaturas a
         INNER JOIN calificaciones c ON a.id = c.asignatura_id
         WHERE c.estatus_asignatura = 'Aprobado' AND c.estudiante_id = e.id)
    ) AS student_backwardness
FROM 
    estudiantes e
LEFT JOIN 
    personas p ON e.persona_id = p.id
WHERE 
    LEFT(e.matricula, 3) = ?
HAVING 
    name != 'Nombre no disponible'
ORDER BY 
    p.nombre ASC
LIMIT ? OFFSET ?;

    `;
    const [rows] = await db.query(query, [generation, limit, offset]);
    return rows;
}


export async function getStudents(limit: number, offset: number) {
    const query = `
    SELECT
        e.matricula as student_code,
        e.estatus AS status,
        e.cuatrimestre_actual as grade,
    COALESCE(p.nombre, 'Nombre no disponible') AS name,
    (
        (SELECT COUNT(*) 
         FROM asignaturas 
         WHERE cuatrimestre <= e.cuatrimestre_actual) -
        (SELECT COUNT(*) 
         FROM asignaturas a
         INNER JOIN calificaciones c ON a.id = c.asignatura_id
         WHERE c.estatus_asignatura = 'Aprobado' AND c.estudiante_id = e.id)
    ) AS student_backwardness
    FROM 
        estudiantes e
    LEFT JOIN 
        personas p ON e.persona_id = p.id
    HAVING 
        name != 'Nombre no disponible'
    ORDER BY 
        p.nombre ASC
        LIMIT ? OFFSET ?;
    `;
    const [rows] = await db.query(query, [limit, offset]);
    return rows;
}
export async function studentInfo(marticula: string) {
    const query = `

    SELECT 
        a.nombre AS asignatura,
        a.cuatrimestre,
        c.ordinario_1,
        c.ordinario_2,
        c.ordinario_3,
        c.recuperacion_1,
        c.recuperacion_2,
        c.recuperacion_3,
    CASE 
        WHEN c.extra = -1 THEN 0 
        ELSE c.extra 
    END AS extra,
    c.final
        FROM calificaciones c
    JOIN estudiantes e ON e.id = c.estudiante_id
    JOIN asignaturas a ON a.id = c.asignatura_id
    WHERE e.matricula = ${marticula};
    `
    return await db.query(query);

}


export async function getstudentInfo(matricula: string) {
    const query = `
    SELECT 
    e.matricula,
    p_est.nombre AS estudiante_nombre,
    p_est.apellido_paterno AS estudiante_apellido_paterno,
    p_est.apellido_materno AS estudiante_apellido_materno,
    p_est.telefono AS estudiante_telefono,
    p_est.curp AS estudiante_curp,
    p_est.sexo AS estudiante_sexo,
    d_est.calle_1 AS estudiante_calle_1,
    d_est.calle_2 AS estudiante_calle_2,
    d_est.numero_interior AS estudiante_numero_interior,
    d_est.numero_exterior AS estudiante_numero_exterior,
    d_est.colonia AS estudiante_colonia,
    d_est.ciudad AS estudiante_ciudad,
    d_est.codigo_postal AS estudiante_codigo_postal,
    d_est.referencias_direccion AS estudiante_referencias_direccion,
    p_tut.nombre AS tutor_nombre,
    p_tut.apellido_paterno AS tutor_apellido_paterno,
    p_tut.apellido_materno AS tutor_apellido_materno,
    p_tut.telefono AS tutor_telefono,
    p_tut.curp AS tutor_curp,
    p_tut.sexo AS tutor_sexo,
    d_tut.calle_1 AS tutor_calle_1,
    d_tut.calle_2 AS tutor_calle_2,
    d_tut.numero_interior AS tutor_numero_interior,
    d_tut.numero_exterior AS tutor_numero_exterior,
    d_tut.colonia AS tutor_colonia,
    d_tut.ciudad AS tutor_ciudad,
    d_tut.codigo_postal AS tutor_codigo_postal,
    d_tut.referencias_direccion AS tutor_referencias_direccion
    FROM estudiantes e
    JOIN personas p_est ON e.persona_id = p_est.id
    LEFT JOIN direcciones d_est ON p_est.id = d_est.persona_id
    LEFT JOIN personas p_tut ON e.tuto_familiar_id = p_tut.id
    LEFT JOIN direcciones d_tut ON p_tut.id = d_tut.persona_id
    WHERE e.matricula = ?;
    `;

    const results = await db.query(query, [matricula]);
    return results[0];
}
