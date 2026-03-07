import { Request, Response, NextFunction } from 'express';
/**
 * Global error handler middleware.
 * Distinguishes operational errors (AppError) from programming errors.
 */
export declare function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error-handler.d.ts.map