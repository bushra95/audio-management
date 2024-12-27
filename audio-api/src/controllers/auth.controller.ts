import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { comparePasswords, hashPassword } from '../utils/auth';
import { generateTokens } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const tokens = generateTokens(user.id);
    res.json(tokens);
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });
    const tokens = generateTokens(user.id);
    res.status(201).json(tokens);
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const refresh = async (_req: Request, res: Response) => {
  try {
    // Add refresh token logic here
    res.json({ message: 'Token refreshed' });
  } catch {
    res.status(500).json({ error: 'Token refresh failed' });
  }
}; 