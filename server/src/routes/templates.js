import express from 'express';
import * as templatesController from '../controllers/templatesController.js';

const router = express.Router();

router.get('/', templatesController.getTemplates);

export default router;
