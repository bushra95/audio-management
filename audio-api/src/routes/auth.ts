import { Router } from 'express';
import type { RequestHandler } from 'express';
import { LoginRequest, LoginResponse, ErrorResponse } from '../types/auth';

const router = Router();

const loginHandler: RequestHandler<object, LoginResponse | ErrorResponse, LoginRequest> = (req, res) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password || password.length < 8) {
    console.log('Validation failed');
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }
  
  console.log('Login successful');
  res.json({
    token: 'test_token',
    refreshToken: 'test_refresh_token',
    user: { id: '1', email }
  });
};

router.post('/login', loginHandler);

export default router; 