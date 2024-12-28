import { Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {localStorage.getItem('auth_token') ? children : <Navigate to="/login" replace />}
    </AuthProvider>
  );
}; 