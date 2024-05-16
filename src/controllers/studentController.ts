import { Request, Response } from 'express';
import * as student from '../models/student';

export class StudentController {

    async getStudentsList(req: Request, res: Response) {
        try {
            const { cohorte } = req.query;
            const limit = parseInt(req.query.limit as string, 10) || 10;  // Límite por defecto
            const page = parseInt(req.query.page as string, 10) || 1;     // Página por defecto
            const offset = (page - 1) * limit;

            const students = await student.getStudents(limit, offset);
            res.status(200).json({
                data: students,
                message: "api.v1.students",
                page: page,
                limit: limit,
            });
        } catch (error: any) {
            res.status(error.http_status ?? 500).json({ message: 'Error', error });
        }
    }

    async getStudentByCohorte(req: Request, res: Response) {
        try {
            const { cohorte } = req.query;
            const limit = parseInt(req.query.limit as string, 10) || 10;  // Límite por defecto
            const page = parseInt(req.query.page as string, 10) || 1;     // Página por defecto
            const offset = (page - 1) * limit;

            console.log('cohorte:', cohorte);
            const students = await student.getStudentByGeneration(cohorte?.toString() ?? '', limit, offset);
            res.status(200).json({
                data: students,
                message: "api.v1.students",
                page: page,
                limit: limit,
            });
        } catch (error: any) {
            res.status(error.http_status ?? 500).json({ message: 'Error', error });
        }
    }

}
