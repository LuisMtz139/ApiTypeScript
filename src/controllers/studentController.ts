import { Request, Response } from "express";
import * as student from '../models/student';
export class StudentController {

    async getStudentsList(req:Request, res:Response) {
        try {

            const students = await student.getStudentsFactory(req.params.cohorte ?? null);
            res.status(200).json({
                data:students,
                message:"api.v1.students"
            });
        } catch (error:any) {
            res.status(error.http_status ?? 500 ).json({ message: 'Error', error });
        }
    }

}