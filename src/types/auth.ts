export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Array<{
    code: string;
    message: string;
  }>;
} 