import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, refreshTokenSchema } from '../schemas/auth.schema';

const router = Router();
const authController = AuthController.getInstance();

router.post('/login',
  validate(loginSchema),
  async (req, res) => {
    await authController.login(req, res);
  }
);

router.post('/refresh',
  validate(refreshTokenSchema),
  async (req, res) => {
    await authController.refresh(req, res);
  }
);

export const authRoutes = router; 