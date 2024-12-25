import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

export class AuthController {
  private static instance: AuthController;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const tokens = this.authService.generateTokens(user);
      res.json(tokens);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      
      const user = await this.authService.validateRefreshToken(refreshToken);
      if (!user) {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
      }

      const tokens = this.authService.generateTokens(user);
      res.json(tokens);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 