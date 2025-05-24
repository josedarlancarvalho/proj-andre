import { Usuario } from '../models';

declare global {
  namespace Express {
    interface Request {
      currentUser?: Usuario;
    }
  }
} 