import express from 'express';
import dotenv from "dotenv";
import { Signale } from "signale";

import cohorteRoutes from './routes/generationRouter';
import studentRouter from './routes/studentRouter';


const app = express();
const signale = new Signale();


app.use(express.json());

app.use('/api/v1/cohortes', cohorteRoutes);
app.use('/api/v1/estudiantes',studentRouter );


dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	signale.success(`Server is running on port ${PORT}`)
});