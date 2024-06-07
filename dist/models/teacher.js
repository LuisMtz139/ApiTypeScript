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
exports.getStudentsGrupo = exports.docentesListByName = exports.docentesList = void 0;
const database_1 = __importDefault(require("../config/database"));
const docentesList = (limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
        SELECT 
            d.id,
            CONCAT(p.nombre) AS nombre_completo,
            GROUP_CONCAT(DISTINCT g.grupo ORDER BY g.grupo SEPARATOR ', ') AS grupos
        FROM 
            docentes d
        JOIN 
            personas p ON d.persona_id = p.id
        JOIN 
            grupos g ON g.docente_id = d.id
        GROUP BY 
            d.id, nombre_completo
        ORDER BY 
            nombre_completo
        LIMIT ? OFFSET ?;
        `;
        const [rows] = yield database_1.default.query(query, [limit, offset]);
        return {
            data: rows,
            message: 'Docentes list fetched successfully'
        };
    }
    catch (error) {
        console.error('Error fetching docentes list:', error);
        return {
            data: null,
            message: 'Error fetching docentes list'
        };
    }
});
exports.docentesList = docentesList;
const docentesListByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
        SELECT 
        d.id,
        g.id ,
            CONCAT(p.nombre) AS nombre_completo,
            GROUP_CONCAT(DISTINCT g.grupo ORDER BY g.grupo SEPARATOR ', ') AS grupos
        FROM 
            docentes d
        JOIN 
            personas p ON d.persona_id = p.id
        JOIN 
            grupos g ON g.docente_id = d.id
        WHERE 
            p.nombre LIKE ?
        GROUP BY 
            d.id, nombre_completo
        ORDER BY 
            nombre_completo;
        `;
        const [rows] = yield database_1.default.query(query, [`%${name}%`]);
        return {
            data: rows,
            message: 'Docentes list by name fetched successfully'
        };
    }
    catch (error) {
        console.error('Error fetching docentes list by name:', error);
        return {
            data: null,
            message: 'Error fetching docentes list by name'
        };
    }
});
exports.docentesListByName = docentesListByName;
const getStudentsGrupo = (id_docente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query('SET SESSION group_concat_max_len = 10000');
        const query = `
        SELECT 
            d.id AS id_docente,
            p.nombre AS docente_nombre,
            g.grupo,
            a.nombre AS asignatura_nombre,
            a.abreviatura,
            GROUP_CONCAT(DISTINCT e.id ORDER BY e.id ASC SEPARATOR ', ') AS estudiante_ids,
            GROUP_CONCAT(DISTINCT e.matricula ORDER BY e.matricula ASC SEPARATOR ', ') AS matriculas,
            GROUP_CONCAT(DISTINCT p2.nombre ORDER BY p2.nombre ASC SEPARATOR ', ') AS estudiantes_nombres
        FROM 
            estudiantes e
        JOIN 
            calificaciones c ON e.id = c.estudiante_id
        JOIN 
            grupos g ON g.id = c.grupo_id
        JOIN 
            asignaturas a ON a.id = g.asignatura_id
        JOIN 
            docentes d ON d.id = g.docente_id
        JOIN 
            personas p ON p.id = d.persona_id
        JOIN 
            personas p2 ON e.persona_id = p2.id
        WHERE 
            d.id = ?
        GROUP BY 
            d.id, p.nombre, g.grupo, a.nombre, a.abreviatura;
        `;
        const [rows] = yield database_1.default.query(query, [id_docente]);
        // Estructurar los datos en un formato más lógico
        const result = rows.reduce((acc, row) => {
            const { id_docente, docente_nombre, grupo, asignatura_nombre, abreviatura, estudiante_ids, matriculas, estudiantes_nombres } = row;
            if (!acc.id_docente) {
                acc.id_docente = id_docente;
                acc.docente_nombre = docente_nombre;
                acc.grupos = [];
            }
            const estudiantes = estudiantes_nombres.split(', ').map((nombre, index) => ({
                id: estudiante_ids.split(', ')[index],
                nombre,
                matricula: matriculas.split(', ')[index]
            }));
            acc.grupos.push({
                grupo,
                asignatura_nombre,
                abreviatura,
                estudiantes
            });
            return acc;
        }, {});
        return {
            data: result,
            message: 'Students by group fetched successfully'
        };
    }
    catch (error) {
        console.error('Error fetching students by group:', error);
        return {
            data: null,
            message: 'Error fetching students by group'
        };
    }
});
exports.getStudentsGrupo = getStudentsGrupo;
