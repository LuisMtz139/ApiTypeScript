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
exports.docentesListByName = exports.docentesList = void 0;
const database_1 = __importDefault(require("../config/database"));
const docentesList = (limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
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
    return rows;
});
exports.docentesList = docentesList;
const docentesListByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
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
    where p.nombre like '%${name}%'
    GROUP BY 
        d.id, nombre_completo
    ORDER BY 
        nombre_completo;
    `;
    const [rows] = yield database_1.default.query(query, [name]);
    return rows;
});
exports.docentesListByName = docentesListByName;
