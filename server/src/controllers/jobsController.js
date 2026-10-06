import * as jobsService from '../services/jobsService.js';

export function createJob(req, res, next) {
  try {
    const { templateId, inputs } = req.body;
    const forceOutcome = req.query.force || req.headers['x-force-outcome'];

    if (!templateId || !inputs) {
      const err = new Error('templateId and inputs are required');
      err.status = 400;
      throw err;
    }

    const jobId = jobsService.createJob(templateId, inputs, forceOutcome);
    res.status(201).json({ jobId });
  } catch (err) {
    next(err);
  }
}

export function getJob(req, res, next) {
  try {
    const { jobId } = req.params;
    const jobState = jobsService.getJob(jobId);
    res.json(jobState);
  } catch (err) {
    next(err);
  }
}

export function likeJobOutput(req, res, next) {
  try {
    const { jobId, outputId } = req.params;
    const { liked } = req.body;

    const failureRate = parseFloat(process.env.LIKE_FAILURE_RATE || '0.12');
    if (Math.random() < failureRate) {
      const err = new Error('Simulated random database failure for like action');
      err.status = 500;
      throw err;
    }

    const output = jobsService.likeJobOutput(jobId, outputId, liked);
    res.json(output);
  } catch (err) {
    next(err);
  }
}
