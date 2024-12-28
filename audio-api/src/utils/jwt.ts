import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
}; 