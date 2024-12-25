import { apiClient } from '../lib/api-client';
import { ENV } from '../config/env';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
}

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
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem(ENV.AUTH_TOKEN_KEY, response.data.token);
    localStorage.setItem(ENV.REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  async logout(): Promise<void> {
    localStorage.removeItem(ENV.AUTH_TOKEN_KEY);
    localStorage.removeItem(ENV.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(ENV.AUTH_TOKEN_KEY);
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(ENV.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken
    });

    localStorage.setItem(ENV.AUTH_TOKEN_KEY, response.data.token);
    localStorage.setItem(ENV.REFRESH_TOKEN_KEY, response.data.refreshToken);
    return response.data.token;
  }
} 