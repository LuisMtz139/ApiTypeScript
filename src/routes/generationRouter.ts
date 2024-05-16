import { Router } from 'express';

import { 
    getGenerations, 
    getGenerationDetail, 
    getGenerationStats 
} from '../controllers/generationController';

const router = Router();

router.get('/', getGenerations);
router.get('/:cohorte', getGenerationDetail);
router.get('/:cohorte/estadisticas', getGenerationStats);


export default router;