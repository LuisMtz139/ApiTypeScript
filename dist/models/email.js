"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../config/database")); // Asegúrate de que la ruta sea correcta
dotenv_1.default.config();
let generatedToken = null;
function sendEmail(cohorte) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const token = crypto_1.default.randomBytes(20).toString('hex');
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
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            // Guardar el token y la fecha de generación en la base de datos
            const query = 'UPDATE estudiantes SET token = ?, token_valido = ? WHERE matricula= ?';
            yield database_1.default.query(query, [token, expires, cohorte]);
            console.log('Token y fecha de generación guardados en la base de datos.');
        }
        catch (error) {
            console.error('Error sending email: ' + error);
        }
    });
}
exports.sendEmail = sendEmail;
function verifyEmail(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = 'SELECT token, token_valido FROM estudiantes WHERE token = ?';
            const [rows] = yield database_1.default.query(query, [token]);
            if (rows.length > 0) {
                const { token_valido } = rows[0];
                const now = new Date();
                if (now <= new Date(token_valido)) {
                    console.log('Email verified successfully');
                    return 'successPage.html';
                }
                else {
                    console.log('Token expired');
                    return 'errorPage.html';
                }
            }
            else {
                console.log('Email verification failed');
                return 'errorPage.html';
            }
        }
        catch (error) {
            console.error('Error verifying email: ' + error);
            return 'errorPage.html';
        }
    });
}
exports.verifyEmail = verifyEmail;
