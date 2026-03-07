import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export default authenticateToken;
//# sourceMappingURL=auth.d.ts.map