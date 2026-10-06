import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './Icons';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function Modal({ isOpen, onClose, title, children, className }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // simple focus trap logic would go here, omitting for brevity but ensuring focus returns
      contentRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        ref={overlayRef}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        ref={contentRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative bg-raised border border-border shadow-soft-lg sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl flex flex-col overflow-hidden animate-scale-in outline-none",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <h2 id="modal-title" className="text-xl font-display font-medium text-ink">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <XIcon />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
