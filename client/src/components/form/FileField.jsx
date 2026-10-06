import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, ImageIcon, XIcon } from '../ui/Icons';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { resizeImage } from '../../utils/resizeImage';
import { cn } from '../../utils/cn';

export function FileField({ id, accept, value, onChange, onBlur, error, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    setIsProcessing(true);
    try {
      const dataUrl = await resizeImage(file);
      onChange(dataUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to process image.');
    } finally {
      setIsProcessing(false);
      onBlur && onBlur();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [disabled]);

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={accept === "image" ? "image/jpeg, image/png" : accept || "image/*"}
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-surface flex flex-col items-center justify-center p-2 h-48">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Replace
            </Button>
            <Button type="button" variant="danger" size="icon" onClick={handleClear}>
              <XIcon />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer",
            isDragging ? "border-primary-500 bg-primary-100/50" : "border-border hover:border-primary-400 bg-surface",
            disabled && "opacity-50 cursor-not-allowed hover:border-border",
            error && "border-danger bg-danger/5 text-danger"
          )}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center text-primary-600 dark:text-primary-400">
              <Spinner className="mb-4" size="lg" />
              <span className="text-sm font-medium">Processing image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted text-center p-4">
              <div className="w-12 h-12 mb-3 rounded-full bg-raised flex items-center justify-center shadow-sm text-primary-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-ink mb-1">Click to upload or drag & drop</span>
              <span className="text-xs">JPEG, PNG up to 25MB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
