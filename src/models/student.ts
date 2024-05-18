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