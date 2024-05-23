import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';

const teacherController = new TeacherController();
const router = Router();

router.get('/', teacherController.handleDocentesRequest.bind(teacherController));
router.get('/:id_docente/grupos', teacherController.getStudentsGrupo.bind(teacherController));

export default router;
