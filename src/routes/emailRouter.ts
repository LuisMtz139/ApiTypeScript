import { Router } from 'express';
import { PersonasController } from '../controllers/emailController';

const router = Router();
const personasController = new PersonasController();


router.get('/:cohorte/verificar-informacion', personasController.sendEmail);
router.post('/verificar-informacion', personasController.verifyEmail);


export default router;