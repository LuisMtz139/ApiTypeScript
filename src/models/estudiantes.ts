import db from '../config/database';



export async function obtener_estudiante_cohorte(cohorte: string) {
    const query = `
    SELECT
            e.id, 
            e.matricula,
            e.estatus,
            e.persona_id,
            COALESCE(p.nombre, 'Nombre no disponible') AS nombre,
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
            END AS tiene_materias_reprobatorias,
            (SELECT COUNT(*) 
            FROM estudiantes e_sub 
            LEFT JOIN personas p_sub ON e_sub.persona_id = p_sub.id 
            WHERE LEFT(e_sub.matricula, 3) = '${cohorte}') AS total_count
    FROM 
        estudiantes e
    LEFT JOIN 
        personas p ON e.persona_id = p.id
    WHERE 
        LEFT(e.matricula, 3) = '${cohorte}'
    HAVING 
        nombre != 'Nombre no disponible';
    `;
    const [rows] = await db.query(query);
    return rows;

}