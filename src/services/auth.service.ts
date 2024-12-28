import { apiClient } from '../lib/api-client';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
} 