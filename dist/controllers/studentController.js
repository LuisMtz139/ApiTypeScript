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
exports.StudentController = void 0;
const student = __importStar(require("../models/student"));
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
}
exports.StudentController = StudentController;