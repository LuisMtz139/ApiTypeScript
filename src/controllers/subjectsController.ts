import { Request, Response } from 'express';
import * as subjects from '../models/subjects';

export class SubjectController {
    async subjectList(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string, 10) || 10;  // Default limit
            const page = parseInt(req.query.page as string, 10) || 1;     // Default page
            const offset = (page - 1) * limit;

            const subje = await subjects.listSubjects(limit, offset);
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
}

