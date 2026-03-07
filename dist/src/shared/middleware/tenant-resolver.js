import { ForbiddenError } from '../errors/app-error.js';
/**
 * Extracts tenantId from authenticated user's JWT and validates it.
 * Must be used AFTER authenticate middleware.
 * Ensures every tenant-scoped request has a valid tenantId.
 */
export function resolveTenant(req, _res, next) {
    if (!req.user?.tenantId) {
        return next(new ForbiddenError('Tenant não identificado. Token inválido.'));
    }
    req.tenantId = req.user.tenantId;
    next();
}
//# sourceMappingURL=tenant-resolver.js.map