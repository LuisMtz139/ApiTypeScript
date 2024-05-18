import { Request, Response } from 'express';
import * as teacher from '../models/teacher';

export class TeacherController {
    async   docentesList(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string, 10) || 10;  // Default limit
            const page = parseInt(req.query.page as string, 10) || 1;     // Default page
            const offset = (page - 1) * limit;

            const subje = await teacher.docentesList(limit, offset);
            res.status(200).json({
                data: subje,
                message: "api.v1.subjects",
                page: page,
                limit: limit,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error', error });
        }
    }

    async docentesListByName(req: Request, res: Response) {
        try {
            const name = req.query.name as string;
            const subje = await teacher.docentesListByName(name);
            res.status(200).json({
                data: subje,
                message: "api.v1.subjects",
            });
        } catch (error) {
            res.status(500).json({ message: 'Error', error });
        }
    }
}

