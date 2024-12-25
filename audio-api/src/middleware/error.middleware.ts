import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Invalid input',
      errors: error.errors
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      res.status(404).json({
        message: 'Record not found'
      });
      return;
    }
    res.status(400).json({
      message: 'Database error',
      code: error.code
    });
    return;
  }

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({ message });
  next(error);
}; 