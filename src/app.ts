import express from 'express';
import cohorteRoutes from './routes/cohorteRoutes';
import estudianteRoutes from './routes/esstudiantesRoutes';


const app = express();

app.use(express.json());
app.use('/api', cohorteRoutes);
app.use('/api',estudianteRoutes );

console.log("jesus")

export default app;
