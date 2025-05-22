import { Router } from 'express';
import authRoutes from './authRoutes';
import usuarioRoutes from './usuarioRoutes';
import empresaRoutes from './empresaRoutes';

const router = Router();

// Prefixos das rotas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);

// Rota para verificar se a API está funcionando
router.get('/health', (req, res) => {
  res.json({ status: 'API Operational', timestamp: new Date() });
});

export default router; 