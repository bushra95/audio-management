import express from 'express';
import { login, register, refresh } from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/refresh', refresh); 
authRouter.post('/refresh', refresh); 