import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate({ to: '/login', replace: true });
    } else if (isAuthenticated && location.pathname === '/login') {
      navigate({ to: '/', replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Audio Transcription Manager
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">
        {(!isAuthenticated && location.pathname === '/login') || isAuthenticated ? children : null}
      </main>
    </div>
  );
} 