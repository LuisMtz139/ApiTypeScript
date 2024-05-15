import express from 'express';
import cohorteRoutes from './src/routes/cohorteRoutes';
import estudianteRoutes from './src/routes/esstudiantesRoutes';

const app = express();

app.use(express.json());
app.use('/api', cohorteRoutes);
app.use('/api',estudianteRoutes );

export default app;
