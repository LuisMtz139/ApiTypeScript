"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generationController_1 = require("../controllers/generationController");
const router = (0, express_1.Router)();
router.get('/', generationController_1.getGenerations);
router.get('/:cohorte', generationController_1.getGenerationDetail);
router.get('/:cohorte/estadisticas', generationController_1.getGenerationStats);
exports.default = router;
