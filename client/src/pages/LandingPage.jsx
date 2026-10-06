import React, { useState, useEffect } from 'react';

export function LandingPage() {
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 100);
    const t2 = setTimeout(() => setExpanded(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const navigateToStudio = () => {
    window.history.pushState({}, '', '/studio');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className={`text-center transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-[clamp(1.8rem,9.5vw,5rem)] font-display font-medium text-ink mb-4 sm:mb-6 tracking-tight leading-[1.1]">
          <span className="whitespace-nowrap">One Click Designer</span> <br />
          <span className="text-primary-600">Studio</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
          Create your first professional product advertisement in seconds. Just upload a product, select a template, and let our AI handle the studio lighting and environment.
        </p>

        <div className="flex justify-center items-center h-20">
          <button
            onClick={navigateToStudio}
            className={`
              relative flex items-center justify-center overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${expanded 
                ? 'w-56 sm:w-64 h-12 sm:h-14 rounded-full bg-primary-600 dark:bg-primary-500 shadow-lg hover:bg-primary-700 dark:hover:bg-primary-400 hover:-translate-y-1 hover:shadow-xl' 
                : 'w-4 h-4 rounded-full bg-primary-600 opacity-0 scale-50'
              }
            `}
            style={{
              opacity: showContent ? (expanded ? 1 : 1) : 0,
              transform: showContent ? (expanded ? 'scale(1)' : 'scale(1)') : 'scale(0.5)'
            }}
          >
            <span 
              className={`font-semibold text-raised dark:text-background text-base sm:text-lg transition-opacity duration-500 whitespace-nowrap ${expanded ? 'opacity-100 delay-300' : 'opacity-0'}`}
            >
              Start Creating
            </span>
            <div className={`absolute inset-0 bg-white/20 dark:bg-white/10 rounded-full blur-md transition-opacity duration-500 ${expanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
