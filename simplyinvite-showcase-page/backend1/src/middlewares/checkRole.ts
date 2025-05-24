import { Request, Response, NextFunction } from 'express';

export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;
    
    if (!usuario || usuario.tipoPerfil !== role) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    
    next();
  };
}; 