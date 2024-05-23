import { Request, Response } from 'express';
import * as teacher from '../models/teacher';

export class TeacherController {
    async handleDocentesRequest(req: Request, res: Response) {
        const name = req.query.name as string;

        if (name) {
            return this.docentesListByName(req, res);
        } else {
            return this.docentesList(req, res);
        }
    }

    async docentesList(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string, 10) || 10;  // Default limit
            const page = parseInt(req.query.page as string, 10) || 1;     // Default page
            const offset = (page - 1) * limit;

            const result = await teacher.docentesList(limit, offset);
            res.status(200).json({
                data: result.data,
                message: result.message,
                page: page,
                limit: limit,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching docentes list', error });
        }
    }

    async docentesListByName(req: Request, res: Response) {
        try {
            const name = req.query.name as string;
            const result = await teacher.docentesListByName(name);
            res.status(200).json({
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching docentes list by name', error });
        }
    }

    async getStudentsGrupo(req: Request, res: Response) {
        try {
            const { id_docente } = req.params;
            const result = await teacher.getStudentsGrupo(id_docente);
            res.status(200).json({
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching students by group', error });
        }
    }
}
