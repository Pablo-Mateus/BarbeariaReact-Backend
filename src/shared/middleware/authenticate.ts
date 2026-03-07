import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, IJwtPayload } from '../types/index.js';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';

export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Acesso negado. Token não fornecido'));
  }

  try {
    const decoded = jwt.verify(token, env.SECRET) as IJwtPayload;
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch {
    return next(new UnauthorizedError('Token inválido ou expirado'));
  }
}
