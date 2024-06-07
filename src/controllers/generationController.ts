import * as generation from '../models/generation';
import {getStudents} from '../models/student';

import { Request, Response } from 'express';

export const getGenerations = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string, 10) || 10;  // Default limit
        const page = parseInt(req.query.page as string, 10) || 1;     // Default page
        const offset = (page - 1) * limit;

        const cohorte = await generation.getAllGenerations(limit, offset);
        res.status(200).json({
            data: cohorte,
            message: "api.v1.generations",
            page: page,
            limit: limit,
        });
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