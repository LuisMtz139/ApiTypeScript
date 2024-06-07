"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const asistencia = __importStar(require("../models/asistencias"));
class AsistenciaController {
    createAttendanceController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estudiante_id = parseInt(req.query.id);
                if (isNaN(estudiante_id)) {
                    return res.status(400).json({ message: 'Invalid student ID' });
                }
                const attendanceData = (0, class_transformer_1.plainToClass)(aistencia_1.CreateAttendanceDTO, req.body);
                const errors = yield (0, class_validator_1.validate)(attendanceData);
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
                yield (0, asistencias_1.createAttendances)(estudiante_id, attendanceData);
                res.status(200).json({ message: 'Attendance records created successfully' });
            }
            catch (error) {
                console.error('Error creating attendance records:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });
    }
    deleteAsistenciasController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencia_id = Number(req.params.asistencia_id);
                const subje = yield asistencia.deleteAsistencias(asistencia_id);
                res.status(200).json({
                    message: "delete asistencia successfull",
                });
            }
            catch (error) {
                console.error('Error deleting attendance records:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });
    }
}
exports.AsistenciaController = AsistenciaController;
