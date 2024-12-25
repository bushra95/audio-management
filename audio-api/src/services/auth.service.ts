import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtPayload, TokenPair, User } from '../types/auth';
import { ENV } from '../config/env';
import { prisma } from '../lib/prisma';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
  }

  generateTokens(user: User): TokenPair {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { token, refreshToken };
  }

  async validateRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const payload = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as JwtPayload;
      return await prisma.user.findUnique({ where: { id: payload.userId } });
    } catch {
      return null;
    }
  }
} 