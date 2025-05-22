import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { authenticate, checkProfileType } from '../middlewares/auth';

const router = Router();

// Rotas públicas
router.post('/', usuarioController.create as any); // Cadastro de usuários

// Rotas protegidas
router.get('/', authenticate as any, usuarioController.getAll as any);
router.get('/:id', authenticate as any, usuarioController.getById as any);
router.put('/:id', authenticate as any, usuarioController.update as any);
router.delete('/:id', authenticate as any, checkProfileType(['hr']) as any, usuarioController.remove as any); // Somente RH pode excluir usuários

// Rota para perfil de usuário (com dados específicos de acordo com o tipo de perfil)
router.get('/:id/perfil', authenticate as any, usuarioController.getPerfilUsuario as any);

// Rota para onboarding de usuário
router.put('/me/onboarding', authenticate as any, usuarioController.completarOnboarding as any);

export default router; 