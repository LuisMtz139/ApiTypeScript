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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student = __importStar(require("../models/student"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_transformer_1 = require("class-transformer");
const updateInfoStudent_1 = require("../dto/updateInfoStudent");
const class_validator_1 = require("class-validator");
const student_1 = require("../models/student"); // Importación nombrada
class StudentController {
    getStudentsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { cohorte } = req.query;
                const limit = parseInt(req.query.limit, 10) || 10; // Límite por defecto
                const page = parseInt(req.query.page, 10) || 1; // Página por defecto
                const offset = (page - 1) * limit;
                const students = yield student.getStudents(limit, offset);
                res.status(200).json({
                    data: students,
                    message: "api.v1.students",
                    page: page,
                    limit: limit,
                });
            }
            catch (error) {
                res.status((_a = error.http_status) !== null && _a !== void 0 ? _a : 500).json({ message: 'Error', error });
            }
        });
    }
    getStudentByCohorte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { cohorte } = req.query;
                const limit = parseInt(req.query.limit, 10) || 10; // Límite por defecto
                const page = parseInt(req.query.page, 10) || 1; // Página por defecto
                const offset = (page - 1) * limit;
                console.log('cohorte:', cohorte);
                const students = yield student.getStudentByGeneration((_a = cohorte === null || cohorte === void 0 ? void 0 : cohorte.toString()) !== null && _a !== void 0 ? _a : '', limit, offset);
                res.status(200).json({
                    data: students,
                    message: "api.v1.students",
                    page: page,
                    limit: limit,
                });
            }
            catch (error) {
                res.status((_b = error.http_status) !== null && _b !== void 0 ? _b : 500).json({ message: 'Error', error });
            }
        });
    }
    studentsInfoMaterias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { matricula } = req.params;
                const studenst = yield student.studentInfo((_a = matricula === null || matricula === void 0 ? void 0 : matricula.toString()) !== null && _a !== void 0 ? _a : '');
                res.json(studenst);
            }
            catch (error) {
                res.status((_b = error.http_status) !== null && _b !== void 0 ? _b : 500).json({ message: 'Error', error });
            }
        });
    }
    getInfoStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hola");
            try {
                const token = req.params.token || req.query.token;
                if (!token || typeof token !== 'string') {
                    return res.status(400).json({ message: 'Token is missing or invalid' });
                }
                // Verifica y decodifica el token
                jsonwebtoken_1.default.verify(token, "your-256-bit-secret", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(401).json({ message: 'Invalid token', error: err.message });
                    }
                    // Asegúrate de que el token decodificado tiene la estructura esperada
                    const decodedToken = decoded;
                    console.log(decodedToken);
                    if (!decodedToken.matricula) {
                        return res.status(400).json({ message: 'Matricula is missing in the token' });
                    }
                    // Realiza la consulta con la matrícula obtenida del token decodificado
                    try {
                        const status = yield student.getstudentInfo(decodedToken.matricula);
                        res.status(200).json({ message: 'Token received', payload: decodedToken, studentStatus: status });
                    }
                    catch (queryError) {
                        res.status(500).json({ message: 'Error querying student info', error: queryError.message });
                    }
                }));
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });
    }
    updateStudentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Recibiendo datos para actualizar información del estudiante");
            try {
                const { matricula, studentData, studentAddressData, tutorData, tutorAddressData } = req.body;
                // Transformar y validar los datos del estudiante
                const studentDataDTO = (0, class_transformer_1.plainToClass)(updateInfoStudent_1.UpdateStudentDTO, studentData);
                const studentAddressDataDTO = (0, class_transformer_1.plainToClass)(updateInfoStudent_1.UpdateStudentAddressDTO, studentAddressData);
                const tutorDataDTO = (0, class_transformer_1.plainToClass)(updateInfoStudent_1.UpdateTutorDTO, tutorData);
                const tutorAddressDataDTO = (0, class_transformer_1.plainToClass)(updateInfoStudent_1.UpdateTutorAddressDTO, tutorAddressData);
                const studentErrors = yield (0, class_validator_1.validate)(studentDataDTO);
                const studentAddressErrors = yield (0, class_validator_1.validate)(studentAddressDataDTO);
                const tutorErrors = yield (0, class_validator_1.validate)(tutorDataDTO);
                const tutorAddressErrors = yield (0, class_validator_1.validate)(tutorAddressDataDTO);
                // Si hay errores de validación, responder con los errores
                if (studentErrors.length > 0 || studentAddressErrors.length > 0 || tutorErrors.length > 0 || tutorAddressErrors.length > 0) {
                    return res.status(400).json({
                        studentErrors,
                        studentAddressErrors,
                        tutorErrors,
                        tutorAddressErrors
                    });
                }
                // Llamar a la función de servicio para actualizar la información
                yield (0, student_1.updateStudentInfo)(matricula, studentDataDTO, studentAddressDataDTO, tutorDataDTO, tutorAddressDataDTO);
                res.status(200).json({ message: 'Student info updated successfully' });
            }
            catch (error) {
                console.error('Error updating student info:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });
    }
}
exports.StudentController = StudentController;
