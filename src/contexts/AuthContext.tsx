import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<LoginResponse>;
  logout: () => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = AuthService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const response = await AuthService.login(data.email, data.password);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 