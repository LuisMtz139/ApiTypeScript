"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../controllers/teacherController");
const teacherController = new teacherController_1.TeacherController();
const router = (0, express_1.Router)();
router.get('/', teacherController.docentesList.bind(teacherController));
router.get('/docentes', teacherController.docentesListByName.bind(teacherController));
exports.default = router;
