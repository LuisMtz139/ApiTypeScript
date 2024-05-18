import { Request, Response } from 'express';
import * as personas from '../models/email';

export class PersonasController {
    
    async sendEmail(req: Request, res: Response) {
        try {
            const { cohorte } = req.params
            console.log(cohorte)
            await personas.sendEmail(cohorte?.toString() ?? '');
            res.status(200).json({
                message: "Email sent successfully"
            });
        } catch (error: any) {
            res.status(error.http_status ?? 500).json({ message: 'Error', error });
        }
    }

    async verifyEmail(req: Request, res: Response) {    
        try {
            const fullToken = req.query.token as string;
            const token = fullToken.split('&')[0];
            console.log('token:', token);
            const result = await personas.verifyEmail(token);
            res.status(200).json({
                data: result,
                message: "api.v1.email",
            });
        } catch (error: any) {
            res.status(error.http_status ?? 500).json({ message: 'Error', error });
        }
    }
}