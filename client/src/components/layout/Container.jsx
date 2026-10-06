import React from 'react';

export default function Container({ children, className = '' }) {
  return (
    <div className={`max-w-6xl w-full mx-auto px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
