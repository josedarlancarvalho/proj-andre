import { Request, Response } from 'express';

export type RequestHandler = (req: Request, res: Response) => Promise<void> | void;

export interface Controller {
  [key: string]: RequestHandler;
} 