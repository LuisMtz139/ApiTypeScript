import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import db from '../config/database'; // Asegúrate de que la ruta sea correcta
import { RowDataPacket } from 'mysql2/promise';

dotenv.config();

let generatedToken: string | null = null;

export async function sendEmail(cohorte: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const token = crypto.randomBytes(20).toString('hex');
    generatedToken = token; // Store the token for later verification payload 

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 2); // The token expires in 2 minutes
    
    let ruta = `${cohorte}@ids.upchiapas.edu.mx`;
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: ruta,
        subject: "Hola buenas tardes",
        html: `<p>Hola,</p><p>Click <a href='http://yourserver.com/verify?token=${token}&expires=${expires.getTime()}'>aquí</a> para verificar tu email.</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        // Guardar el token y la fecha de generación en la base de datos
        const query = 'UPDATE estudiantes SET token = ?, token_valido = ? WHERE matricula= ?';
        await db.query(query, [token, expires, cohorte]);

        console.log('Token y fecha de generación guardados en la base de datos.');
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}

interface EstudianteRow extends RowDataPacket {
    token: string;
    token_valido: Date;
}

export async function verifyEmail(token: string) {
    try {
        const query = 'SELECT token, token_valido FROM estudiantes WHERE token = ?';
        const [rows] = await db.query<EstudianteRow[]>(query, [token]);

        if (rows.length > 0) {
            const { token_valido } = rows[0];
            const now = new Date();

            if (now <= new Date(token_valido)) {
                console.log('Email verified successfully');
                return 'successPage.html';
            } else {
                console.log('Token expired');
                return 'errorPage.html';
            }
        } else {
            console.log('Email verification failed');
            return 'errorPage.html';
        }
    } catch (error) {
        console.error('Error verifying email: ' + error);
        return 'errorPage.html';
    }
}
