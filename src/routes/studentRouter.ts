import { Router } from 'express';
import { getStudentList } from '../controllers/studentController';


const router = Router();

router.get('/',getStudentList.bind(getStudentList));

export default router;