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
exports.studentInfo = exports.getStudents = exports.getStudentByGeneration = void 0;
const database_1 = __importDefault(require("../config/database"));
function getStudentByGeneration(generation, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    
    SELECT
    e.matricula AS student_code,
    e.estatus AS status,
    e.cuatrimestre_actual AS grade,
    COALESCE(p.nombre, 'Nombre no disponible') AS name,
    (
        (SELECT COUNT(*) 
         FROM asignaturas 
         WHERE cuatrimestre <= e.cuatrimestre_actual) -
        (SELECT COUNT(*) 
         FROM asignaturas a
         INNER JOIN calificaciones c ON a.id = c.asignatura_id
         WHERE c.estatus_asignatura = 'Aprobado' AND c.estudiante_id = e.id)
    ) AS student_backwardness
FROM 
    estudiantes e
LEFT JOIN 
    personas p ON e.persona_id = p.id
WHERE 
    LEFT(e.matricula, 3) = ?
HAVING 
    name != 'Nombre no disponible'
ORDER BY 
    p.nombre ASC
LIMIT ? OFFSET ?;

    `;
        const [rows] = yield database_1.default.query(query, [generation, limit, offset]);
        return rows;
    });
}
exports.getStudentByGeneration = getStudentByGeneration;
function getStudents(limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    SELECT
        e.matricula as student_code,
        e.estatus AS status,
        e.cuatrimestre_actual as grade,
    COALESCE(p.nombre, 'Nombre no disponible') AS name,
    (
        (SELECT COUNT(*) 
         FROM asignaturas 
         WHERE cuatrimestre <= e.cuatrimestre_actual) -
        (SELECT COUNT(*) 
         FROM asignaturas a
         INNER JOIN calificaciones c ON a.id = c.asignatura_id
         WHERE c.estatus_asignatura = 'Aprobado' AND c.estudiante_id = e.id)
    ) AS student_backwardness
    FROM 
        estudiantes e
    LEFT JOIN 
        personas p ON e.persona_id = p.id
    HAVING 
        name != 'Nombre no disponible'
    ORDER BY 
        p.nombre ASC
        LIMIT ? OFFSET ?;
    `;
        const [rows] = yield database_1.default.query(query, [limit, offset]);
        return rows;
    });
}
exports.getStudents = getStudents;
function studentInfo(marticula) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `

    SELECT 
        a.nombre AS asignatura,
        a.cuatrimestre,
        c.ordinario_1,
        c.ordinario_2,
        c.ordinario_3,
        c.recuperacion_1,
        c.recuperacion_2,
        c.recuperacion_3,
    CASE 
        WHEN c.extra = -1 THEN 0 
        ELSE c.extra 
    END AS extra,
    c.final
        FROM calificaciones c
    JOIN estudiantes e ON e.id = c.estudiante_id
    JOIN asignaturas a ON a.id = c.asignatura_id
    WHERE e.matricula = ${marticula};
    `;
        return yield database_1.default.query(query);
    });
}
exports.studentInfo = studentInfo;
