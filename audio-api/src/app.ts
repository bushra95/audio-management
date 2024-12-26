import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { authRoutes } from './routes/auth.routes';
import { transcriptionRoutes } from './routes/transcription.routes';
import { errorHandler } from './middleware/error.middleware';
import { healthRoutes } from './routes/health.routes';

const app = express();

app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transcriptions', transcriptionRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware should be last
app.use(errorHandler);

export { app }; 