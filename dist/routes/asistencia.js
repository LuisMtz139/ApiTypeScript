"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asistencias_1 = require("../controllers/asistencias");
const router = (0, express_1.Router)();
const personasController = new asistencias_1.AsistenciaController();
router.post('/agregar', personasController.createAttendanceController);
exports.default = router;
