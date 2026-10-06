import React from 'react';
import { Header } from './Header';
import Container from './Container';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col py-8 sm:py-12">
        <Container>
          {children}
        </Container>
      </main>
      <footer className="py-6 border-t border-border/50 text-center text-sm text-muted">
        <Container>
          <p>© {new Date().getFullYear()} OneClickDesigner</p>
        </Container>
      </footer>
    </div>
  );
}
