import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Rota pública para login
router.post('/login', authController.login as any);

// Rota protegida para obter os dados do usuário autenticado
router.get('/me', authenticate as any, authController.getMeuPerfil as any);

export default router; 