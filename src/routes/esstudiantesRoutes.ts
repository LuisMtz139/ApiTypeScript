import { Router } from 'express';
import { obtener_estudiante } from '../controllers/estudiantesController';


const router = Router();

router.get('/estudaintes/:cohorte',obtener_estudiante );



export default router;