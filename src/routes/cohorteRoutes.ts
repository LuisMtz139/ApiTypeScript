import { Router } from 'express';
import { getCohorte, getCohorteByCohorte, obtener_infromacion_cohorte } from '../controllers/cohorteController';

const router = Router();

router.get('/cohorte', getCohorte);
router.get('/cohorte/:cohorte', getCohorteByCohorte);
router.get('/cohorte/:cohorte/informacion_general', obtener_infromacion_cohorte);


export default router;