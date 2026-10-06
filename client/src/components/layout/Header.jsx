import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LogoIcon } from '../ui/Icons';
import Container from './Container';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
      <Container className="h-16 flex items-center justify-between">
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <span className="font-display font-bold text-xl tracking-tighter italic -rotate-3 text-primary-600 dark:text-primary-500">
            OCD
          </span>
          <div className="flex flex-col">
            <span className="font-display font-medium text-lg leading-none tracking-tight">The One Click Designer</span>
          </div>
        </a>
        <ThemeToggle />
      </Container>
    </header>
  );
}
