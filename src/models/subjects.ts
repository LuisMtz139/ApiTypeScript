import { QueryResult } from 'mysql2';
import db from '../config/database';

export const listSubjects = async(limit: number, offset: number) => {
    const query = `
        SELECT nombre, cuatrimestre
        FROM asignaturas
        ORDER BY cuatrimestre + 0 ASC
        LIMIT ? OFFSET ?;
    `;

    const [rows] = await db.query(query, [limit, offset]);
    return rows;
};



