import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { authRouter } from './routes/auth.routes';
import { Request, Response, } from 'express';

export const app = express();

// CORS configuration
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// API routes with prefix
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
}); 