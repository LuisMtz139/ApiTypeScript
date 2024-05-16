import { Router } from 'express';
import { StudentController } from '../controllers/studentController';

const studentController = new StudentController();


const router = Router();

router.get('/',studentController.getStudentsList.bind(studentController));
router.get('/cohorte', studentController.getStudentByCohorte.bind(studentController));

export default router;