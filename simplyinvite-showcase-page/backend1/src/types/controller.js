import { Request, Response } from 'express';

export type RequestHandler = (
  req: Request,
  res: Response
) => Promise<void | Response> | void | Response; 