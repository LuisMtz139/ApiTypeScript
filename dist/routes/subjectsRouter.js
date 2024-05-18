"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectsController_1 = require("../controllers/subjectsController");
const subjectController = new subjectsController_1.SubjectController();
const router = (0, express_1.Router)();
router.get('/', subjectController.subjectList.bind(subjectController));
exports.default = router;
