import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = AuthController.getInstance();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));

export const authRoutes = router; 