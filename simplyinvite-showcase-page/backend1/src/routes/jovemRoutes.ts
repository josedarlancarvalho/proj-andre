import { Router } from 'express';
import * as jovemController from '../controllers/jovemController';
import { authenticate } from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

const router = Router();

// Middleware de autenticação e verificação de papel
router.use(authenticate);
router.use(checkRole('jovem'));

// Validações
const projetoValidation = [
  body('titulo').notEmpty().withMessage('O título é obrigatório'),
  body('descricao').notEmpty().withMessage('A descrição é obrigatória'),
  body('tecnologias').isArray().withMessage('Tecnologias deve ser um array'),
  body('linkRepositorio').optional().isURL().withMessage('Link do repositório inválido'),
  body('linkDeploy').optional().isURL().withMessage('Link do deploy inválido')
];

const perfilValidation = [
  body('nomeCompleto').optional().notEmpty().withMessage('Nome completo não pode ser vazio'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  body('linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn deve ser uma URL válida'),
  body('github')
    .optional()
    .isURL()
    .withMessage('GitHub deve ser uma URL válida')
];

// Rotas para projetos
router.get('/projetos/meus', jovemController.buscarMeusProjetos);
router.get('/projetos/:id', jovemController.buscarProjeto);
router.post('/projetos', projetoValidation, validateRequest, jovemController.criarProjeto);
router.put('/projetos/:id', projetoValidation, validateRequest, jovemController.atualizarProjeto);
router.delete('/projetos/:id', jovemController.excluirProjeto);

// Rotas para feedbacks
router.get('/feedbacks', jovemController.buscarFeedbacks);

// Rotas para convites
router.get('/convites', jovemController.buscarConvites);
router.post('/convites/:id/aceitar', jovemController.aceitarConvite);
router.post('/convites/:id/recusar', jovemController.recusarConvite);

// Rotas para perfil
router.get('/perfil', jovemController.buscarPerfil);
router.put('/perfil', perfilValidation, validateRequest, jovemController.atualizarPerfil);

// Rota para estatísticas
router.get('/estatisticas', jovemController.buscarEstatisticas);

// Rota para evolução
router.get('/evolucao', jovemController.buscarEvolucao);

// Rota para onboarding
router.post('/onboarding', perfilValidation, validateRequest, jovemController.completarOnboarding);

export default router; 