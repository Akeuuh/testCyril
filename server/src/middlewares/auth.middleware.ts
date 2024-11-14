import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export const authMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.status(401).json({ message: 'Not authenticated' });
      return
    }

    const token = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':')[1];
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
    }

    req.token = token;
    next();
  };
};