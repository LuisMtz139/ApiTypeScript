import { Router } from 'express';
import {  TeacherController } from '../controllers/teacherController';

const teacherController = new TeacherController();


const router = Router();


router.get('/', teacherController.docentesList.bind(teacherController));
router.get('/docentes', teacherController.docentesListByName.bind(teacherController));

export default router;