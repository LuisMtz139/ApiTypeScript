import { Router } from 'express';
import {  SubjectController } from '../controllers/subjectsController';

const subjectController = new SubjectController();


const router = Router();


router.get('/', subjectController.subjectList.bind(subjectController));

export default router;