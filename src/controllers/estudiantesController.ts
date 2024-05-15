import * as EstudianteModel from '../models/estudiantes';
import { Request, Response } from 'express';



export const obtener_estudiante = async (req: Request, res: Response) => {

    try {
        const estudiante = await EstudianteModel.obtener_estudiante_cohorte(req.params.cohorte);
        res.json(estudiante);
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }

}