import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { ForbiddenError } from '../errors/app-error.js';

/**
 * Extracts tenantId from authenticated user's JWT and validates it.
 * Must be used AFTER authenticate middleware.
 * Ensures every tenant-scoped request has a valid tenantId.
 */
export function resolveTenant(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user?.tenantId) {
    return next(new ForbiddenError('Tenant não identificado. Token inválido.'));
  }

  req.tenantId = req.user.tenantId;
  next();
}
