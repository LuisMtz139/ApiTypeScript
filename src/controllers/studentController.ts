import { Request, Response } from 'express';
import * as student from '../models/student';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    matricula: string;
    [key: string]: any;
}

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

    async studentsInfoMaterias(req: Request, res: Response) {

        try {
            const { matricula } = req.params;
            const studenst = await student.studentInfo(matricula?.toString() ?? '');
            res.json(studenst);
        } catch (error: any) {
            res.status(error.http_status ?? 500).json({ message: 'Error', error });
        }

    }


    async getInfoStudents(req: Request, res: Response) {
        console.log("hola")
            try {
                const token = req.params.token || req.query.token;

                if (!token || typeof token !== 'string') {
                    return res.status(400).json({ message: 'Token is missing or invalid' });
                }

                // Verifica y decodifica el token
                jwt.verify(token, "your-256-bit-secret", async (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: 'Invalid token', error: err.message });
                    }

                    // Asegúrate de que el token decodificado tiene la estructura esperada
                    const decodedToken = decoded as DecodedToken;
                    console.log(decodedToken)
                    if (!decodedToken.matricula) {
                        return res.status(400).json({ message: 'Matricula is missing in the token' });
                    }

                    // Realiza la consulta con la matrícula obtenida del token decodificado
                    try {
                        const status = await student.getstudentInfo(decodedToken.matricula);
                        res.status(200).json({ message: 'Token received', payload: decodedToken, studentStatus: status });
                    } catch (queryError: any) {
                        res.status(500).json({ message: 'Error querying student info', error: queryError.message });
                    }
                });
            } catch (error: any) {
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
    }
}
