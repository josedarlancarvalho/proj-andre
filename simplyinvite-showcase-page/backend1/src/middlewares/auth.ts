import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Usuario } from '../models';

// Extender interface Request para incluir usuário autenticado
declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pegar o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Não autorizado: Token não fornecido' });
    }

    // Extrair o token sem o prefixo 'Bearer '
    const token = authHeader.split(' ')[1];
    
    // Verificar o token
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Não autorizado: Token inválido' });
    }

    // Buscar usuário no banco de dados
    const usuario = await Usuario.findByPk(decodedToken.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Não autorizado: Usuário não encontrado' });
    }

    // Passar o usuário para o request para uso nos controllers
    req.currentUser = usuario;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Erro de autenticação' });
  }
};

// Middleware para verificar o tipo de perfil
export const checkProfileType = (profileTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Não autorizado: Usuário não autenticado' });
    }

    if (!profileTypes.includes(req.currentUser.tipoPerfil)) {
      return res.status(403).json({ 
        message: `Acesso negado: Apenas perfis ${profileTypes.join(', ')} podem acessar este recurso` 
      });
    }

    next();
  };
}; 