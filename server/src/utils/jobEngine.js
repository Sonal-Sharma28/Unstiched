import { jobsStore } from '../data/store.js';

const CONFIG = {
  durationMs: 25000,
  stages: [
    { name: 'queued', label: 'Waiting in the queue', endMs: 2000 },
    { name: 'processing', label: 'Reading your product details', endMs: 6000 },
    { name: 'stage_1', label: 'Composing the layout', endMs: 12000 },
    { name: 'stage_2', label: 'Rendering lighting and depth', endMs: 18000 },
    { name: 'stage_3', label: 'Final touch-ups and export', endMs: 25000 },
  ]
};

export function calculateJobState(job) {
  const now = Date.now();
  const elapsed = now - job.createdAt;
  
  if (job.status === 'failed' && elapsed > 18000) {
    // If it's a failed job, lock it in failed state after stage_2
    return {
      status: 'failed',
      currentStepLabel: 'Job failed during rendering.',
      progress: 60,
      failureReason: job.failureReason,
      outputs: []
    };
  }

  if (elapsed >= CONFIG.durationMs) {
    if (job.outcome === 'fail') {
      return {
        status: 'failed',
        currentStepLabel: 'Failed to complete job.',
        progress: 100,
        failureReason: job.failureReason,
        outputs: []
      };
    }
    
    // Complete (success or partial)
    const isPartial = job.outcome === 'partial';
    return {
      status: 'complete',
      currentStepLabel: 'Done',
      progress: 100,
      outputs: job.outputs,
      ...(isPartial ? { partial: true, expectedOutputs: 4 } : {})
    };
  }

  // Find current stage
  let currentStage = CONFIG.stages[CONFIG.stages.length - 1];
  for (const stage of CONFIG.stages) {
    if (elapsed < stage.endMs) {
      currentStage = stage;
      break;
    }
  }

  // Check if it's meant to fail at stage_2
  if (job.outcome === 'fail' && currentStage.name === 'stage_3') {
    return {
      status: 'failed',
      currentStepLabel: 'Failed during rendering.',
      progress: 65,
      failureReason: job.failureReason,
      outputs: []
    };
  }

  // Calculate smooth progress
  let progress = Math.floor((elapsed / CONFIG.durationMs) * 100);
  if (progress > 99) progress = 99; // cap at 99 until truly complete

  return {
    status: currentStage.name,
    currentStepLabel: currentStage.label,
    progress,
    outputs: [] // hide outputs until complete
  };
}
