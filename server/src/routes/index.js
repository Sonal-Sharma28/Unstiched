import express from 'express';
import templatesRouter from './templates.js';
import jobsRouter from './jobs.js';
import healthRouter from './health.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/templates', templatesRouter);
router.use('/jobs', jobsRouter);

export default router;
