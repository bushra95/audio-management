import { apiClient } from '@/lib/api-client';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password
    });
    
    // Store tokens
    localStorage.setItem('auth_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    
    return data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  getToken() {
    return localStorage.getItem('auth_token');
  }
}; 