import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const fs = require('fs');

  if (!token) {
    fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Auth Failed: No token\n`);
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Auth Failed: ${err.message}\n`);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded as { userId: string; email: string; role: string; };
    fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Auth Success: user=${req.user.userId}\n`);
    next();
  });
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};
