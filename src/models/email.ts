import nodemailer from 'nodemailer';

import crypto from 'crypto';
import dotenv from 'dotenv';

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
    generatedToken = token; // Store the token for later verification

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 1); // The token expires in 2 minutes
    
    let ruta = `${cohorte}@ids.upchiapas.edu.mx`
    const mailOptions = {

        from: process.env.EMAIL_USERNAME,
        to: ruta,
        subject: "Hola beunas tadres",
        // Add the token and expiration date as parameters in the URL
        html: `<p>ssssss</p><p>Click <a href='http://yourserver.com/verify?token=${token}&expires=${expires.getTime()}'>here</a> to visit our site.</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}

export async function verifyEmail(token: string) {
    console.log('tokenssssssssss:', token);
    if (token === generatedToken) {
        console.log('Email verified successfully');
        return 'successPage.html';

    } else {
        console.log('Email verification failed');
        return 'errorPage.html';

    }
}