import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { StudioPage } from './pages/StudioPage';
import { LandingPage } from './pages/LandingPage';
import { ToastProvider } from './components/ui/Toast';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return (
    <ToastProvider>
      <AppShell>
        {currentPath === '/studio' ? <StudioPage /> : <LandingPage />}
      </AppShell>
    </ToastProvider>
  );
}

export default App;
