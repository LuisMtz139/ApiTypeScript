import * as student from '../models/student';
import { Request, Response } from 'express';



export const getStudentList = async (req: Request, res: Response) => {

    try {
        const estudiante = await student.getStudentsFactory(req.params.cohorte ?? null);
        res.json(estudiante);
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }

}