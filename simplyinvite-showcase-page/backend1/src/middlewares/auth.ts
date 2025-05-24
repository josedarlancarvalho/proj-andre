import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ProfileType } from '../types/profiles';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  id: number;
  email: string;
  tipoPerfil: 'jovem' | 'rh' | 'gestor';
}

declare global {
  namespace Express {
    interface Request {
      usuario?: DecodedToken;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.usuario = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const checkProfileType = (allowedProfiles: ProfileType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProfile = (req as any).usuario?.tipoPerfil;
      
      if (!userProfile || !allowedProfiles.includes(userProfile)) {
        return res.status(403).json({ 
          message: 'Acesso negado: perfil não autorizado para esta operação' 
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao verificar perfil do usuário' });
    }
  };
}; 