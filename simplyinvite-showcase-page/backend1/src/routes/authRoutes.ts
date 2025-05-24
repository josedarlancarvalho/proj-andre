import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as usuarioController from '../controllers/usuarioController';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();

// Validação para login
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
  body('tipoPerfil')
    .isIn(['jovem', 'rh', 'gestor'])
    .withMessage('Tipo de perfil inválido')
];

// Rotas públicas
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/verificar-token', authController.verificarToken);

// Rota pública para registro
router.post('/register', usuarioController.create);

// Rota protegida para obter os dados do usuário autenticado
router.get('/me', authenticate, authController.getMeuPerfil);

export default router; 