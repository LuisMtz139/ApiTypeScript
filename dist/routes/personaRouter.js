"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
const personasController = new emailController_1.PersonasController();
router.get('/sendEmail', personasController.sendEmail);
exports.default = router;
