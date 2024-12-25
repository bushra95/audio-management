export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  token: string;
  refreshToken: string;
} 