import { apiClient } from '../lib/api-client';
import { ENV } from '../config/env';
import { LoginCredentials, AuthResponse } from '../types/auth';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    console.log('Logging in with:', credentials);
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    console.log('Login response:', response.data);
    localStorage.setItem(ENV.AUTH_TOKEN_KEY, response.data.token);
    localStorage.setItem(ENV.REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  async logout(): Promise<void> {
    localStorage.removeItem(ENV.AUTH_TOKEN_KEY);
    localStorage.removeItem(ENV.REFRESH_TOKEN_KEY);
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    console.log('Checking auth:', localStorage.getItem(ENV.AUTH_TOKEN_KEY));
    return !!localStorage.getItem(ENV.AUTH_TOKEN_KEY);
  }
} 