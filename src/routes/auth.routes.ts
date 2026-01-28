import { Router } from 'express';
import { register, login, loginSession, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { registerValidation, loginValidation } from '../utils/validation';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/login/session', loginValidation, loginSession);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
