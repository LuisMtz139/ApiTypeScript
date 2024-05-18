import { QueryResult } from 'mysql2';
import db from '../config/database';

export const docentesList = async(limit: number, offset: number) => {
    const query = `
    SELECT 
        d.id,
        CONCAT(p.nombre) AS nombre_completo,
        GROUP_CONCAT(DISTINCT g.grupo ORDER BY g.grupo SEPARATOR ', ') AS grupos
    FROM 
        docentes d
    JOIN 
        personas p ON d.persona_id = p.id
    JOIN 
        grupos g ON g.docente_id = d.id
    GROUP BY 
        d.id, nombre_completo
    ORDER BY 
        nombre_completo
        LIMIT ? OFFSET ?;
    `
    const [rows] = await db.query(query, [limit, offset]);
    return rows;
};

export const docentesListByName = async(name: string ) => {

    const query = `
    SELECT 
        d.id,
        CONCAT(p.nombre) AS nombre_completo,
        GROUP_CONCAT(DISTINCT g.grupo ORDER BY g.grupo SEPARATOR ', ') AS grupos
    FROM 
        docentes d
    JOIN 
        personas p ON d.persona_id = p.id
    JOIN 
        grupos g ON g.docente_id = d.id
    where p.nombre like '%${name}%'
    GROUP BY 
        d.id, nombre_completo
    ORDER BY 
        nombre_completo;
    `
    const [rows] = await db.query(query, [name]);
    return rows;
};