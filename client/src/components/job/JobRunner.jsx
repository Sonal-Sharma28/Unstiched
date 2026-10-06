import React, { useEffect } from 'react';
import { useJobPolling } from '../../hooks/useJobPolling';
import { ProgressBar } from '../ui/ProgressBar';
import { StageStepper } from './StageStepper';
import { ResultBanner } from './ResultBanner';
import { ResultsGrid } from '../results/ResultsGrid';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export function JobRunner({ jobId, templateName, onReset, onRetry }) {
  const { job, status, error, retry } = useJobPolling(jobId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (error === 'run not found') {
    return (
      <div className="max-w-4xl mx-auto w-full pt-12 animate-fade-up text-center">
        <h2 className="text-3xl font-display font-medium text-ink mb-4">Run not found</h2>
        <p className="text-muted mb-8">This job may have expired or never existed.</p>
        <Button onClick={onReset}>Start a new run</Button>
      </div>
    );
  }

  if (error === 'connection lost') {
    return (
      <div className="max-w-4xl mx-auto w-full pt-12 animate-fade-up">
        <ResultBanner
          type="failed"
          title="Connection Lost"
          description="We lost connection to the server while polling your job."
          actionText="Retry Connection"
          onAction={retry}
        />
      </div>
    );
  }

  // Not loaded yet
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto w-full pt-8 animate-fade-up">
        <div className="bg-raised rounded-2xl border border-border shadow-soft p-6 sm:p-10 text-center space-y-6">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between max-w-sm mx-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const isFailed = status === 'failed';
  const isComplete = status === 'complete';
  const isPartial = isComplete && job.partial;

  // Calculate est time based on typical 25s run
  const estSecondsLeft = Math.max(0, Math.ceil(25 * (1 - (job.progress / 100))));

  return (
    <div className="max-w-5xl mx-auto w-full pb-24 pt-4 sm:pt-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink mb-2">
            {isComplete ? 'Your set is ready' : 'Crafting your design'}
          </h2>
          <p className="text-base sm:text-lg text-muted">
            {templateName ? `Using ${templateName}` : `Job ID: ${job.id}`}
          </p>
        </div>
        {isFailed && (
          <Button variant="secondary" onClick={onReset}>Start a new run</Button>
        )}
      </div>

      {!isComplete && !isFailed && (
        <div className="bg-raised rounded-2xl border border-border shadow-soft p-6 sm:p-8 mb-8 space-y-8 animate-fade-in">
          <div>
            <div className="flex justify-between items-end mb-3">
              <span className="font-display text-lg text-primary-700 dark:text-primary-400 transition-opacity duration-300">
                {job.currentStepLabel || 'Initializing...'}
              </span>
              <span className="text-sm text-muted">
                {job.progress > 0 && job.progress < 100 && `~${estSecondsLeft}s left`}
              </span>
            </div>
            <ProgressBar progress={job.progress} />
          </div>
          <StageStepper currentStatus={status} />
        </div>
      )}

      {isFailed && (
        <div className="mb-8 animate-fade-in">
          <ResultBanner
            type="failed"
            title="Generation Failed"
            description={job.failureReason || `The job failed at stage: ${status}`}
            actionText="Try Again"
            onAction={onRetry}
          />
        </div>
      )}

      {isPartial && (
        <div className="mb-8 animate-fade-in">
          <ResultBanner
            type="partial"
            title="3 of 4 came back"
            description="One of the generations failed during processing. Here are the ones that succeeded."
            actionText="Generate again"
            onAction={onRetry}
          />
        </div>
      )}

      {(isComplete || (!isFailed && job.outputs && job.outputs.length > 0)) && (
        <ResultsGrid outputs={job.outputs || []} jobId={job.id} templateName={templateName} onReset={onReset} />
      )}

      {(!isComplete && !isFailed && (!job.outputs || job.outputs.length === 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-surface/50 border border-border flex items-center justify-center">
              <Spinner className="w-8 h-8 text-primary/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
