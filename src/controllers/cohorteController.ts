import * as CohorteModel from '../models/cohorte';
import { Request, Response } from 'express';


export const getCohorte = async (req: Request, res: Response) => {
    try {
        const cohorte = await CohorteModel.getAllCorhorte();
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
}


export const getCohorteByCohorte = async (req: Request, res: Response) => {
    try {
        const cohorte = await CohorteModel.getCohorteBychorte(req.params.cohorte);
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
}


export const obtener_infromacion_cohorte = async (req: Request, res: Response) => {

    try {
        const cohorte = await CohorteModel.obtener_infromacion_general(req.params.cohorte);
        res.json(cohorte);
    } catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
}