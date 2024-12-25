import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthService } from '../services/auth.service';

const authService = AuthService.getInstance();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  return <>{children}</>;
} 