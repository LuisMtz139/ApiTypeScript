import * as generation from '../models/generation';
import {getStudents} from '../models/student';

import { Request, Response } from 'express';
//TODO: VERIFICAR LAS RESPUESTAS AGREGANDO CODIGOS DE ERROR Y RESPUESTA CON MENSAJE Y API CODE

export const getGenerations = async (req: Request, res: Response) => {
    try {
        const cohorte = await generation.getAllGenerations();
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
} 

export const getGenerationDetail = async (req: Request, res: Response) => {
    try {
        const cohorte = await generation.getGenerationDetail(req.params.cohorte);
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
}


export const getGenerationStats = async (req: Request, res: Response) => {

    try {
        const cohorte = await generation.stats(req.params.cohorte);
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
}