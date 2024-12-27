import cors from 'cors';
import { app } from './app';
import { ENV } from './config/env';

// Configure CORS
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true
}));

// Add root route handler
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Audio API is running',
    version: '1.0.0'
  });
});

// Add health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
}); 