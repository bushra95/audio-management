export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token'
} as const; 