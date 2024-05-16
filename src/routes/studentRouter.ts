import { Router } from 'express';
import { getStudentList } from '../controllers/studentController';


const router = Router();

router.get('/',getStudentList);

export default router;