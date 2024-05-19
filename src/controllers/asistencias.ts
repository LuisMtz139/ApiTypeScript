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
    
            // Verificar que el id es un número válido
            if (isNaN(estudiante_id)) {
                return res.status(400).json({ message: 'Invalid student ID' });
            }
    
            // Transformar y validar los datos de asistencia
            const attendanceData = plainToClass(CreateAttendanceDTO, req.body);
    
            // Validar los datos
            const errors = await validate(attendanceData);
    
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
    
            // Llamar al servicio para crear la asistencia
            await createAttendances(estudiante_id, attendanceData);
    
            res.status(200).json({ message: 'Attendance records created successfully' });
        } catch (error: any) {
            console.error('Error creating attendance records:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }


async deleteAsistenciasController(req: Request, res: Response) {
    try {
        const id_docente = Number(req.params.id_docente);
        const subje = await asistencia.deleteAsistencias(id_docente);
        res.status(200).json({
            data: subje,
            message: "api.v1.subjects",
        });
        
    } catch (error: any) {
        console.error('Error creating attendance records:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
    

}


