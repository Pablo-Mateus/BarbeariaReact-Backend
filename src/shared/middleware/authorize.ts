import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/index.js';
import { ForbiddenError } from '../errors/app-error.js';

/**
 * Middleware factory that restricts access to specific roles.
 * Must be used AFTER authenticate middleware.
 * 
 * Usage: authorize('owner', 'barber')
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError('Acesso negado. Usuário não autenticado'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Você não tem permissão para acessar este recurso'));
    }

    next();
  };
}
