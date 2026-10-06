import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Skeleton } from '../components/ui/Skeleton';
import { SparkleIcon, AlertIcon, CheckIcon } from '../components/ui/Icons';
import { useTemplates } from '../hooks/useTemplates';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { SchemaForm } from '../components/form/SchemaForm';
import { JobRunner } from '../components/job/JobRunner';
import { createJob } from '../api/endpoints';
import { cn } from '../utils/cn';
import product2 from '../images/product2.jpg';
import product3 from '../images/product3.jpg';
import product4 from '../images/product4.jpg';

// In-memory cache for retries
let lastSubmittedPayload = null;

export function StudioPage() {
  const { data: templates, isLoading: templatesLoading, error: templatesError, retry: retryTemplates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { values, errors, setValue, validateField, validate, reset } = useSchemaForm(selectedTemplate?.inputSchema);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [activeJobId, setActiveJobId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('job');
    }
    return null;
  });

  // Handle popstate for back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveJobId(params.get('job'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when activeJobId changes programmatically
  const updateJobId = useCallback((id) => {
    setActiveJobId(id);
    const url = new URL(window.location);
    if (id) {
      url.searchParams.set('job', id);
    } else {
      url.searchParams.delete('job');
    }
    window.history.pushState({}, '', url);
  }, []);

  // Sync last used template if we have one, otherwise leave blank
  useEffect(() => {
    if (templates && templates.length > 0 && !selectedTemplate && !activeJobId) {
      if (lastSubmittedPayload) {
        const lastTpl = templates.find(t => t.id === lastSubmittedPayload.templateId);
        if (lastTpl) setSelectedTemplate(lastTpl);
      }
    }
  }, [templates, selectedTemplate, activeJobId]);

  // Reset form when template changes
  useEffect(() => {
    if (selectedTemplate) {
      reset(selectedTemplate.inputSchema);
      setSubmitError(null);
    }
  }, [selectedTemplate, reset]);

  const runJob = async (templateId, inputs) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await createJob(templateId, inputs);
      lastSubmittedPayload = { templateId, inputs };
      updateJobId(res.jobId);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!validate()) {
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(firstErrorId)?.focus();
      }
      return;
    }
    runJob(selectedTemplate.id, values);
  };

  const handleRetry = () => {
    if (lastSubmittedPayload) {
      runJob(lastSubmittedPayload.templateId, lastSubmittedPayload.inputs);
    } else {
      // If refreshed, payload is lost. Return to form.
      updateJobId(null);
    }
  };

  const handleReset = () => {
    updateJobId(null);
    if (selectedTemplate) {
      reset(selectedTemplate.inputSchema);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeJobId) {
    const activeTemplateName = templates?.find(t => t.id === lastSubmittedPayload?.templateId)?.name;
    return (
      <div className="animate-fade-in">
        <JobRunner
          jobId={activeJobId}
          templateName={activeTemplateName}
          onReset={handleReset}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="pb-24 sm:pb-12 max-w-5xl mx-auto w-full animate-fade-in">
      <section className="mb-8 md:mb-12 text-center sm:text-left">
        <p className="text-eyebrow text-primary-600 mb-3 uppercase">STUDIO</p>
        <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-display font-medium text-ink mb-4 tracking-tight">
          Design packaging worth picking up.
        </h1>
        <p className="text-lead text-muted max-w-[65ch] mx-auto sm:mx-0">
          Choose a template, share a few details about your product, and collect a polished set of visuals in moments.
        </p>
      </section>

      {templatesError && (
        <Card className="p-6 border-danger/30 bg-danger/5 text-danger flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <AlertIcon className="w-5 h-5" />
            <span>{templatesError}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={retryTemplates}>Retry</Button>
        </Card>
      )}

      {submitError && (
        <div className="mb-8 p-4 rounded-xl bg-danger/10 text-danger border border-danger/20 flex items-start gap-3 animate-fade-up">
          <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{submitError}</div>
          <button onClick={() => setSubmitError(null)} className="text-danger hover:opacity-70">
            <span className="sr-only">Dismiss</span>&times;
          </button>
        </div>
      )}

      <section className="mb-10 md:mb-12">
        <h2 className="text-xl font-medium text-ink mb-6">Choose a Template</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-6 sm:-mx-2 sm:px-2">
          {templatesLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex sm:block items-start gap-4 sm:gap-0 w-full">
                <Skeleton className="aspect-[3/4] w-24 sm:w-full shrink-0 rounded-2xl sm:mb-3" />
                <div className="flex-1 min-w-0 py-2 sm:py-0">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : (
            templates?.map((tpl, index) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={cn(
                    "flex sm:block items-start gap-4 sm:gap-0 text-left transition-all duration-300 relative group outline-none w-full",
                    isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                  )}
                >
                  <div className={cn(
                    "relative aspect-[3/4] w-24 sm:w-full shrink-0 rounded-2xl overflow-hidden sm:mb-3 border transition-shadow",
                    isSelected ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-border bg-surface"
                  )}>
                    <img
                      src={[product2, product3, product4][index] || tpl.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={cn("absolute inset-0 bg-ink/20 transition-opacity", isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100")} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-raised flex items-center justify-center shadow-sm animate-scale-in">
                        <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1 sm:py-0">
                    <h3 className="font-medium text-base text-ink mb-1">{tpl.name}</h3>
                    <p className="text-sm text-muted line-clamp-2">{tpl.description}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <SchemaForm
        schema={selectedTemplate?.inputSchema}
        values={values}
        errors={errors}
        onChange={setValue}
        onBlur={validateField}
        disabled={isSubmitting}
      />

      {/* Mobile Sticky Action Bar / Desktop Inline Button */}
      {selectedTemplate && (
        <div className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-surface/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-border sm:border-t-0 sm:mt-10 z-30 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            className="w-full sm:w-auto sm:min-w-[200px]"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            <SparkleIcon className="w-5 h-5 mr-2" />
            Generate
          </Button>
        </div>
      )}
    </div>
  );
}
