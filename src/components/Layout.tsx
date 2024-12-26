import { Header } from './Header';
import { useNavigate, Outlet } from '@tanstack/react-router';
import { AuthService } from '../services/auth.service';
import { useEffect } from 'react';

export function Layout() {
  console.log('Layout rendering');
  const navigate = useNavigate();
  const authService = AuthService.getInstance();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    console.log('Layout effect, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated && window.location.pathname !== '/login') {
      navigate({ to: '/login' });
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
} 