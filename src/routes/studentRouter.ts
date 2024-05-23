import { Router } from 'express';
import { StudentController } from '../controllers/studentController';

const studentController = new StudentController();
const router = Router();

// Usa el método handleGetStudents para manejar ambas rutas
router.get('/', studentController.handleGetStudents.bind(studentController));
router.get('/:matricula/asignaturas', studentController.studentsInfoMaterias.bind(studentController));

// Validación del momento de mandar el correo y el token 
router.get('/info/student/:token', studentController.getInfoStudents.bind(studentController));
router.put('/info/student/', studentController.updateStudentController.bind(studentController));

export default router;
