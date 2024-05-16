import { Request, Response } from "express";
import * as student from '../models/student';
export class StudentController {

    async getStudentsList(req:Request, res:Response) {
        console.log(req.query)
        try {
            const {cohorte} = req.query;
            const students = await student.getStudentsFactory(cohorte);
            res.status(200).json({
                data:students,
                message:"api.v1.students"
            });
        } catch (error:any) {
            res.status(error.http_status ?? 500 ).json({ message: 'Error', error });
        }
    }

}