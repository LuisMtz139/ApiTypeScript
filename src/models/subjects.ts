import { QueryResult } from 'mysql2';
import db from '../config/database';

export const listSubjects = async(limit: number, offset: number) => {
    const query = `
    SELECT nombre, abreviatura , creditos, horas_semana  cuatrimestre
        FROM asignaturas
            ORDER BY cuatrimestre + 0 asc
        LIMIT ? OFFSET ?;
    `;

    const [rows] = await db.query(query, [limit, offset]);
    return rows;
};




