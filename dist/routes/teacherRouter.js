"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../controllers/teacherController");
const teacherController = new teacherController_1.TeacherController();
const router = (0, express_1.Router)();
router.get('/', teacherController.handleDocentesRequest.bind(teacherController));
router.get('/:id_docente/grupos', teacherController.getStudentsGrupo.bind(teacherController));
exports.default = router;
