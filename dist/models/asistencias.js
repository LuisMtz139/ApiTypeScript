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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsistencias = exports.createAttendances = void 0;
const class_validator_1 = require("class-validator");
const database_1 = __importDefault(require("../config/database"));
function createAttendances(grupo_id, attendanceData) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = yield (0, class_validator_1.validate)(attendanceData);
        if (errors.length > 0) {
            throw new Error(`Validation failed for attendance data: ${errors}`);
        }
        for (const attendance of attendanceData.asistencias) {
            const createAttendanceQuery = `
        INSERT INTO asistencia (estudiante_id, grupo_id, comentarios)
        VALUES (?, ?, ?);
        `;
            yield database_1.default.query(createAttendanceQuery, [
                attendance.estudiante_id,
                grupo_id,
                attendance.comentarios
            ]);
        }
    });
}
exports.createAttendances = createAttendances;
const deleteAsistencias = (grupo_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('grupo_id:', grupo_id);
    const query = `
          
    delete  from  asistencia where id = ${grupo_id};

    `;
    const [rows] = yield database_1.default.query(query);
    return rows;
});
exports.deleteAsistencias = deleteAsistencias;
