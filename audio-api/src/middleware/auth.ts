import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/transcription';

export const requireAuth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  // For now, just check if token exists
  if (token === 'test_token') {
    next();
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
}; 