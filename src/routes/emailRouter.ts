import { Router } from 'express';
import { PersonasController } from '../controllers/emailController';

const router = Router();
const personasController = new PersonasController();


router.get('/sendEmail/:cohorte', personasController.sendEmail);
router.post('/verifyEmail', personasController.verifyEmail);


export default router;