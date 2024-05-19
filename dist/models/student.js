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
exports.updateStudentInfo = exports.getstudentInfo = exports.studentInfo = exports.getStudents = exports.getStudentByGeneration = void 0;
const database_1 = __importDefault(require("../config/database"));
const class_validator_1 = require("class-validator");
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
FROM 
    calificaciones c
JOIN 
    estudiantes e ON e.id = c.estudiante_id
JOIN 
    asignaturas a ON a.id = c.asignatura_id
WHERE 
    e.matricula = ${marticula};
    `;
        const results = yield database_1.default.query(query, [marticula]);
        return results[0];
    });
}
exports.studentInfo = studentInfo;
function getstudentInfo(matricula) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    SELECT 
    e.matricula,
    p_est.nombre AS estudiante_nombre,
    p_est.apellido_paterno AS estudiante_apellido_paterno,
    p_est.apellido_materno AS estudiante_apellido_materno,
    p_est.telefono AS estudiante_telefono,
    p_est.curp AS estudiante_curp,
    p_est.sexo AS estudiante_sexo,
    d_est.calle_1 AS estudiante_calle_1,
    d_est.calle_2 AS estudiante_calle_2,
    d_est.numero_interior AS estudiante_numero_interior,
    d_est.numero_exterior AS estudiante_numero_exterior,
    d_est.colonia AS estudiante_colonia,
    d_est.ciudad AS estudiante_ciudad,
    d_est.codigo_postal AS estudiante_codigo_postal,
    d_est.referencias_direccion AS estudiante_referencias_direccion,
    p_tut.nombre AS tutor_nombre,
    p_tut.apellido_paterno AS tutor_apellido_paterno,
    p_tut.apellido_materno AS tutor_apellido_materno,
    p_tut.telefono AS tutor_telefono,
    p_tut.curp AS tutor_curp,
    p_tut.sexo AS tutor_sexo,
    d_tut.calle_1 AS tutor_calle_1,
    d_tut.calle_2 AS tutor_calle_2,
    d_tut.numero_interior AS tutor_numero_interior,
    d_tut.numero_exterior AS tutor_numero_exterior,
    d_tut.colonia AS tutor_colonia,
    d_tut.ciudad AS tutor_ciudad,
    d_tut.codigo_postal AS tutor_codigo_postal,
    d_tut.referencias_direccion AS tutor_referencias_direccion
    FROM estudiantes e
    JOIN personas p_est ON e.persona_id = p_est.id
    LEFT JOIN direcciones d_est ON p_est.id = d_est.persona_id
    LEFT JOIN personas p_tut ON e.tuto_familiar_id = p_tut.id
    LEFT JOIN direcciones d_tut ON p_tut.id = d_tut.persona_id
    WHERE e.matricula = ?;
    `;
        const results = yield database_1.default.query(query, [matricula]);
        return results[0];
    });
}
exports.getstudentInfo = getstudentInfo;
function updateStudentInfo(matricula, studentData, studentAddressData, tutorData, tutorAddressData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validar los DTOs
        const studentErrors = yield (0, class_validator_1.validate)(studentData);
        const studentAddressErrors = yield (0, class_validator_1.validate)(studentAddressData);
        const tutorErrors = yield (0, class_validator_1.validate)(tutorData);
        const tutorAddressErrors = yield (0, class_validator_1.validate)(tutorAddressData);
        // Si hay errores de validación, lanzarlos
        if (studentErrors.length > 0) {
            throw new Error(`Validation failed for student data: ${studentErrors}`);
        }
        if (studentAddressErrors.length > 0) {
            throw new Error(`Validation failed for student address data: ${studentAddressErrors}`);
        }
        if (tutorErrors.length > 0) {
            throw new Error(`Validation failed for tutor data: ${tutorErrors}`);
        }
        if (tutorAddressErrors.length > 0) {
            throw new Error(`Validation failed for tutor address data: ${tutorAddressErrors}`);
        }
        // Actualizar datos del estudiante
        const updateStudentQuery = `
    UPDATE personas
    SET 
        nombre = ?,
        apellido_paterno = ?,
        apellido_materno = ?,
        telefono = ?,
        curp = ?,
        sexo = ?
    WHERE id = (
        SELECT persona_id 
        FROM estudiantes 
        WHERE matricula = ?
    );
    `;
        yield database_1.default.query(updateStudentQuery, [
            studentData.nombre,
            studentData.apellido_paterno,
            studentData.apellido_materno,
            studentData.telefono,
            studentData.curp,
            studentData.sexo,
            matricula
        ]);
        // Actualizar dirección del estudiante
        const updateStudentAddressQuery = `
    UPDATE direcciones
    SET 
        calle_1 = ?,
        calle_2 = ?,
        numero_interior = ?,
        numero_exterior = ?,
        colonia = ?,
        ciudad = ?,
        codigo_postal = ?,
        referencias_direccion = ?
    WHERE persona_id = (
        SELECT persona_id 
        FROM estudiantes 
        WHERE matricula = ?
    );
    `;
        yield database_1.default.query(updateStudentAddressQuery, [
            studentAddressData.calle_1,
            studentAddressData.calle_2,
            studentAddressData.numero_interior,
            studentAddressData.numero_exterior,
            studentAddressData.colonia,
            studentAddressData.ciudad,
            studentAddressData.codigo_postal,
            studentAddressData.referencias_direccion,
            matricula
        ]);
        // Actualizar datos del tutor
        const updateTutorQuery = `
    UPDATE personas
    SET 
        nombre = ?,
        apellido_paterno = ?,
        apellido_materno = ?,
        telefono = ?,
        curp = ?,
        sexo = ?
    WHERE id = (
        SELECT tuto_familiar_id 
        FROM estudiantes 
        WHERE matricula = ?
    );
    `;
        yield database_1.default.query(updateTutorQuery, [
            tutorData.nombre,
            tutorData.apellido_paterno,
            tutorData.apellido_materno,
            tutorData.telefono,
            tutorData.curp,
            tutorData.sexo,
            matricula
        ]);
        // Actualizar dirección del tutor
        const updateTutorAddressQuery = `
    UPDATE direcciones
    SET 
        calle_1 = ?,
        calle_2 = ?,
        numero_interior = ?,
        numero_exterior = ?,
        colonia = ?,
        ciudad = ?,
        codigo_postal = ?,
        referencias_direccion = ?
    WHERE persona_id = (
        SELECT tuto_familiar_id 
        FROM estudiantes 
        WHERE matricula = ?
    );
    `;
        yield database_1.default.query(updateTutorAddressQuery, [
            tutorAddressData.calle_1,
            tutorAddressData.calle_2,
            tutorAddressData.numero_interior,
            tutorAddressData.numero_exterior,
            tutorAddressData.colonia,
            tutorAddressData.ciudad,
            tutorAddressData.codigo_postal,
            tutorAddressData.referencias_direccion,
            matricula
        ]);
    });
}
exports.updateStudentInfo = updateStudentInfo;
