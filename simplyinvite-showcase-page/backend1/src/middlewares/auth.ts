import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

export const checkRole = (role: 'jovem' | 'rh' | 'gestor') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.usuario;
    
    if (!usuario || usuario.tipoPerfil !== role) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    
    next();
  };
}; 