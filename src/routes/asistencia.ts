import { Router } from 'express';
import { PersonasController } from '../controllers/emailController';
import { AsistenciaController } from '../controllers/asistencias';

const router = Router();
const personasController = new AsistenciaController();


router.post('/agregar', personasController.createAttendanceController);
router.delete('/asistencias/:asistencia_id', personasController.deleteAsistenciasController);

export default router;