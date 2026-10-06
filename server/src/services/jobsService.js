import crypto from 'crypto';
import { jobsStore, templates } from '../data/store.js';
import { calculateJobState } from '../utils/jobEngine.js';

function determineOutcome(forceOutcome) {
  if (['success', 'partial', 'fail'].includes(forceOutcome)) {
    return forceOutcome;
  }
  const r = Math.random();
  if (r < 0.10) return 'fail';
  if (r < 0.30) return 'partial';
  return 'success';
}

function parseDimensions(aspectRatio) {
  const map = {
    '1:1': { w: 1024, h: 1024 },
    '16:9': { w: 1024, h: 576 },
    '9:16': { w: 576, h: 1024 },
    '4:5': { w: 819, h: 1024 }
  };
  return map[aspectRatio] || map['1:1'];
}

export function createJob(templateId, inputs, forceOutcome) {
  const template = templates.find(t => t.id === templateId);
  if (!template) {
    const err = new Error('Template not found');
    err.status = 400;
    throw err;
  }

  // Validate required inputs (omitting large image validation logic beyond checking presence)
  for (const [key, field] of Object.entries(template.inputSchema)) {
    if (field.required && (inputs[key] === undefined || inputs[key] === null || inputs[key] === '')) {
      const err = new Error(`Missing required field: ${key}`);
      err.status = 400;
      throw err;
    }
  }

  const jobId = crypto.randomUUID();
  const outcome = determineOutcome(forceOutcome);
  const numOutputs = outcome === 'partial' ? 3 : 4;
  
  const aspectRatio = inputs.aspectRatio || '1:1';
  const { w, h } = parseDimensions(aspectRatio);

  const outputs = [];
  if (outcome !== 'fail') {
    for (let i = 1; i <= numOutputs; i++) {
      outputs.push({
        id: `out_${jobId}_${i}`,
        url: `https://picsum.photos/seed/${jobId}-${i}/${w}/${h}`,
        width: w,
        height: h,
        liked: false
      });
    }
  }

  const job = {
    id: jobId,
    templateId,
    createdAt: Date.now(),
    outcome,
    outputs,
    failureReason: outcome === 'fail' ? 'Image generation timed out connecting to GPU cluster.' : undefined,
    inputs: { ...inputs, productImage: undefined } // clear large data URL
  };

  jobsStore.set(jobId, job);
  return jobId;
}

export function getJob(jobId) {
  const job = jobsStore.get(jobId);
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }

  const currentState = calculateJobState(job);
  
  return {
    jobId: job.id,
    templateId: job.templateId,
    createdAt: job.createdAt,
    status: currentState.status,
    currentStepLabel: currentState.currentStepLabel,
    progress: currentState.progress,
    outputs: currentState.outputs,
    ...(currentState.failureReason ? { failureReason: currentState.failureReason } : {}),
    ...(currentState.partial ? { partial: true, expectedOutputs: currentState.expectedOutputs } : {})
  };
}

export function likeJobOutput(jobId, outputId, liked) {
  const job = jobsStore.get(jobId);
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }

  const output = job.outputs.find(o => o.id === outputId);
  if (!output) {
    const err = new Error('Output not found');
    err.status = 404;
    throw err;
  }

  output.liked = !!liked;
  return output;
}
