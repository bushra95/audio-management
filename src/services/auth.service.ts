import { apiClient } from '../lib/api-client';
import { ENV } from '../config/env';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  static async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }

  isAuthenticated(): boolean {
    console.log('Checking auth:', localStorage.getItem(ENV.AUTH_TOKEN_KEY));
    return !!localStorage.getItem(ENV.AUTH_TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(ENV.AUTH_TOKEN_KEY);
    localStorage.removeItem(ENV.REFRESH_TOKEN_KEY);
    window.location.href = '/login';
  }
} 