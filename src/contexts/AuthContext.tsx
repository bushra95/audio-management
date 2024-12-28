import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authService = AuthService.getInstance();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 