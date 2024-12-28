import { PrismaClient } from '@prisma/client';
import { comparePasswords, hashPassword } from '../utils/auth';

export class AuthService {
  private static instance: AuthService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    const isValid = await comparePasswords(password, user.password);
    return isValid ? user : null;
  }
} 