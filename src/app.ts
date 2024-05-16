import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { Signale } from "signale";

import cohorteRoutes from './routes/generationRouter';
import studentRouter from './routes/studentRouter';


const app = express();
const signale = new Signale();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/cohortes', cohorteRoutes);
app.use('/api/v1/estudiantes',studentRouter );


dotenv.config();

const PORT = process.env.PORT ;

app.listen(PORT, () => {
	signale.success(`Server is running on port ${PORT}`)
});