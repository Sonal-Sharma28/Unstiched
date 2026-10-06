import express from 'express';
import * as jobsController from '../controllers/jobsController.js';

const router = express.Router();

router.post('/', jobsController.createJob);
router.get('/:jobId', jobsController.getJob);
router.patch('/:jobId/outputs/:outputId/like', jobsController.likeJobOutput);

export default router;
