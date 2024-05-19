"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenciaController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const aistencia_1 = require("../dto/aistencia");
const asistencias_1 = require("../models/asistencias");
class AsistenciaController {
    createAttendanceController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estudiante_id = parseInt(req.query.id);
                // Verificar que el id es un número válido
                if (isNaN(estudiante_id)) {
                    return res.status(400).json({ message: 'Invalid student ID' });
                }
                // Transformar y validar los datos de asistencia
                const attendanceData = (0, class_transformer_1.plainToClass)(aistencia_1.CreateAttendanceDTO, req.body);
                // Validar los datos
                const errors = yield (0, class_validator_1.validate)(attendanceData);
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
                // Llamar al servicio para crear la asistencia
                yield (0, asistencias_1.createAttendances)(estudiante_id, attendanceData);
                res.status(200).json({ message: 'Attendance records created successfully' });
            }
            catch (error) {
                console.error('Error creating attendance records:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });
    }
}
exports.AsistenciaController = AsistenciaController;
