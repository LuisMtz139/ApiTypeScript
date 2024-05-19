import { validate } from 'class-validator';
import { CreateAttendanceDTO } from '../dto/aistencia';
import db from '../config/database';



export async function createAttendances(grupo_id: number, attendanceData: CreateAttendanceDTO) {
    const errors = await validate(attendanceData);

    if (errors.length > 0) {
        throw new Error(`Validation failed for attendance data: ${errors}`);
    }

    for (const attendance of attendanceData.attendances) {
        const createAttendanceQuery = `
        INSERT INTO asistencia (estudiante_id, grupo_id, comentarios)
        VALUES (?, ?, ?);
        `;

        await db.query(createAttendanceQuery, [
            attendance.estudiante_id,
            grupo_id,
            attendance.comentarios
        ]);
    }
}

export const deleteAsistencias = async (grupo_id: number) => {

    const query = `
        DELETE FROM asistencia 
            WHERE estudiante_id = ${grupo_id};

    `;

    const [rows] = await db.query(query);
    return rows;
}
