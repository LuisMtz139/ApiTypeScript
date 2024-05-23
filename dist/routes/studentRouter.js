"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const studentController = new studentController_1.StudentController();
const router = (0, express_1.Router)();
// Usa el método handleGetStudents para manejar ambas rutas
router.get('/', studentController.handleGetStudents.bind(studentController));
router.get('/:matricula/asignaturas', studentController.studentsInfoMaterias.bind(studentController));
// Validación del momento de mandar el correo y el token 
router.get('/info/student/:token', studentController.getInfoStudents.bind(studentController));
router.put('/info/student/', studentController.updateStudentController.bind(studentController));
exports.default = router;
