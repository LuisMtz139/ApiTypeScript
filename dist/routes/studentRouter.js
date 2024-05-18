"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const studentController = new studentController_1.StudentController();
const router = (0, express_1.Router)();
router.get('/', studentController.getStudentsList.bind(studentController));
router.get('/cohorte', studentController.getStudentByCohorte.bind(studentController));
router.get('/info/:matricula', studentController.studentsInfoMaterias.bind(studentController));
exports.default = router;
