import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuthService } from '../services/auth.service';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const authService = AuthService.getInstance();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  );
} 