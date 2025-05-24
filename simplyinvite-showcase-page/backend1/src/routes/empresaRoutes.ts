import { Router } from 'express';
import * as empresaController from '../controllers/empresaController';
import { authenticate, checkProfileType } from '../middlewares/auth';

const router = Router();

// Lista todas as empresas - acessível para todos os usuários autenticados
router.get('/', authenticate as any, empresaController.getAll as any);

// Obtém empresa por ID - acessível para todos os usuários autenticados
router.get('/:id', authenticate as any, empresaController.getById as any);

// Cria uma nova empresa - apenas usuários HR ou manager
router.post('/', authenticate as any, checkProfileType(['rh', 'gestor']) as any, empresaController.create as any);

// Atualiza uma empresa - apenas usuários HR ou manager
router.put('/:id', authenticate as any, checkProfileType(['rh', 'gestor']) as any, empresaController.update as any);

// Remove uma empresa - apenas usuários HR
router.delete('/:id', authenticate as any, checkProfileType(['rh']) as any, empresaController.remove as any);

export default router; 