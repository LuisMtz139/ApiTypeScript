import { RowDataPacket } from 'mysql2';
import db from '../config/database';

interface ApiResponse<T> {
    data: T | null;
    message: string;
}

export const docentesList = async (limit: number, offset: number): Promise<ApiResponse<RowDataPacket[]>> => {
    try {
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
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [limit, offset]);
        return {
            data: rows,
            message: 'Docentes list fetched successfully'
        };
    } catch (error) {
        console.error('Error fetching docentes list:', error);
        return {
            data: null,
            message: 'Error fetching docentes list'
        };
    }
};

export const docentesListByName = async (name: string): Promise<ApiResponse<RowDataPacket[]>> => {
    try {
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
        WHERE 
            p.nombre LIKE ?
        GROUP BY 
            d.id, nombre_completo
        ORDER BY 
            nombre_completo;
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [`%${name}%`]);
        return {
            data: rows,
            message: 'Docentes list by name fetched successfully'
        };
    } catch (error) {
        console.error('Error fetching docentes list by name:', error);
        return {
            data: null,
            message: 'Error fetching docentes list by name'
        };
    }
};
export const getStudentsGrupo = async (id_docente: string): Promise<ApiResponse<any>> => {
    try {
        // Aumenta el tamaño máximo de GROUP_CONCAT en la sesión de MySQL
        await db.query('SET SESSION group_concat_max_len = 10000');

        const query = `
        SELECT 
            d.id AS id_docente,
            p.nombre AS docente_nombre,
            g.grupo,
            a.nombre AS asignatura_nombre,
            a.abreviatura,
            GROUP_CONCAT(DISTINCT e.id ORDER BY e.id ASC SEPARATOR ', ') AS estudiante_ids,
            GROUP_CONCAT(DISTINCT e.matricula ORDER BY e.matricula ASC SEPARATOR ', ') AS matriculas,
            GROUP_CONCAT(DISTINCT p2.nombre ORDER BY p2.nombre ASC SEPARATOR ', ') AS estudiantes_nombres
        FROM 
            estudiantes e
        JOIN 
            calificaciones c ON e.id = c.estudiante_id
        JOIN 
            grupos g ON g.id = c.grupo_id
        JOIN 
            asignaturas a ON a.id = g.asignatura_id
        JOIN 
            docentes d ON d.id = g.docente_id
        JOIN 
            personas p ON p.id = d.persona_id
        JOIN 
            personas p2 ON e.persona_id = p2.id
        WHERE 
            d.id = ?
        GROUP BY 
            d.id, p.nombre, g.grupo, a.nombre, a.abreviatura;
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [id_docente]);

        // Estructurar los datos en un formato más lógico
        const result = rows.reduce((acc: any, row: any) => {
            const { id_docente, docente_nombre, grupo, asignatura_nombre, abreviatura, estudiante_ids, matriculas, estudiantes_nombres } = row;

            if (!acc.id_docente) {
                acc.id_docente = id_docente;
                acc.docente_nombre = docente_nombre;
                acc.grupos = [];
            }

            const estudiantes = estudiantes_nombres.split(', ').map((nombre: string, index: number) => ({
                id: estudiante_ids.split(', ')[index],
                nombre,
                matricula: matriculas.split(', ')[index]
            }));

            acc.grupos.push({
                grupo,
                asignatura_nombre,
                abreviatura,
                estudiantes
            });

            return acc;
        }, {});

        return {
            data: result,
            message: 'Students by group fetched successfully'
        };
    } catch (error) {
        console.error('Error fetching students by group:', error);
        return {
            data: null,
            message: 'Error fetching students by group'
        };
    }
};