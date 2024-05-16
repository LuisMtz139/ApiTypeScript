import { QueryResult } from 'mysql2';
import db from '../config/database';



export async function getStudentByGeneration(generation: string, limit: number, offset: number) {
    const query = `
        SELECT
            e.id,
            e.matricula AS student_code,
            e.estatus,
            e.cuatrimestre_actual AS grade,
            COALESCE(p.nombre, 'Nombre no disponible') AS name,
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
            END AS student_backwardness
        FROM 
            estudiantes e
        LEFT JOIN 
            personas p ON e.persona_id = p.id
        WHERE 
            LEFT(e.matricula, 3) = ?
        HAVING 
            name != 'Nombre no disponible'
        LIMIT ? OFFSET ?;
    `;
    const [rows] = await db.query(query, [generation, limit, offset]);
    return rows;
}


export async function getStudents(limit: number, offset: number) {
    const query = `
        SELECT
            e.id,
            e.matricula AS student_code,
            e.estatus,
            e.cuatrimestre_actual AS grade,
        COALESCE(p.nombre, 'Nombre no disponible') AS name,
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
        END AS student_backwardness
        
    FROM 
        estudiantes e
    LEFT JOIN 
        personas p ON e.persona_id = p.id
    HAVING 
        name != 'Nombre no disponible'
    LIMIT ? OFFSET ?;
    `;
    const [rows] = await db.query(query, [limit, offset]);
    return rows;
}
