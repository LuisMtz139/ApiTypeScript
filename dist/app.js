"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const signale_1 = require("signale");
const generationRouter_1 = __importDefault(require("./routes/generationRouter"));
const studentRouter_1 = __importDefault(require("./routes/studentRouter"));
const subjectsRouter_1 = __importDefault(require("./routes/subjectsRouter"));
const emailRouter_1 = __importDefault(require("./routes/emailRouter"));
const app = (0, express_1.default)();
const signale = new signale_1.Signale();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/api/v1/cohortes', generationRouter_1.default);
app.use('/api/v1/estudiantes', studentRouter_1.default);
app.use('/api/v1/subjects', subjectsRouter_1.default);
app.use('/api/v1/email', emailRouter_1.default);
dotenv_1.default.config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    signale.success(`Server is running on port ${PORT}`);
});