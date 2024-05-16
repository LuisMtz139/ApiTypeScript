import express from 'express';
import cohorteRoutes from './src/routes/cohorteRoutes';
import estudianteRoutes from './src/routes/esstudiantesRoutes';

const app = express();

app.use(express.json());


// api/v1
app.use('/api/v1', cohorteRoutes);
app.use('/api/v1',estudianteRoutes );

export default app;
