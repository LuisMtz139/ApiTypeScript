import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAttendanceDTO } from '../dto/aistencia';
import { createAttendances } from '../models/asistencias';
import * as asistencia from '../models/asistencias';


export class AsistenciaController {


    async createAttendanceController(req: Request, res: Response) {
        try {
            const estudiante_id = parseInt(req.query.id as string);

            if (isNaN(estudiante_id)) {
                return res.status(400).json({ message: 'Invalid student ID' });
            }

            const attendanceData = plainToClass(CreateAttendanceDTO, req.body);
            const errors = await validate(attendanceData);

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            await createAttendances(estudiante_id, attendanceData);

            res.status(200).json({ message: 'Attendance records created successfully' });
        } catch (error: any) {
            console.error('Error creating attendance records:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }


    async deleteAsistenciasController(req: Request, res: Response) {
        try {
            const asistencia_id = Number(req.params.asistencia_id);
            const subje = await asistencia.deleteAsistencias(asistencia_id);
            res.status(200).json({
                message: "delete asistencia successfull",
            });

        } catch (error: any) {
            console.error('Error deleting attendance records:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }


}


