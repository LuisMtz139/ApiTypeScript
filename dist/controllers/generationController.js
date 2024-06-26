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
exports.getGenerationStats = exports.getGenerationDetail = exports.getGenerations = void 0;
const generation = __importStar(require("../models/generation"));
const getGenerations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit, 10) || 10; // Default limit
        const page = parseInt(req.query.page, 10) || 1; // Default page
        const offset = (page - 1) * limit;
        const cohorte = yield generation.getAllGenerations(limit, offset);
        res.status(200).json({
            data: cohorte,
            message: "api.v1.generations",
            page: page,
            limit: limit,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
});
exports.getGenerations = getGenerations;
const getGenerationDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cohorte = yield generation.getGenerationDetail(req.params.cohorte);
        res.json(cohorte);
    }
    catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
});
exports.getGenerationDetail = getGenerationDetail;
const getGenerationStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cohorte = yield generation.stats(req.params.cohorte);
        res.json(cohorte);
    }
    catch (error) {
        res.status(500).json({ message: 'Error get By Cohorte', error });
    }
});
exports.getGenerationStats = getGenerationStats;
