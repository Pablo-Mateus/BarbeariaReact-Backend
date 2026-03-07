import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';
export function authenticate(req, _res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('Acesso negado. Token não fornecido'));
    }
    try {
        const decoded = jwt.verify(token, env.SECRET);
        req.user = decoded;
        req.tenantId = decoded.tenantId;
        next();
    }
    catch {
        return next(new UnauthorizedError('Token inválido ou expirado'));
    }
}
//# sourceMappingURL=authenticate.js.map