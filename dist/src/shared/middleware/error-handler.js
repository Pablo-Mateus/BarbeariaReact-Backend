import { AppError } from '../errors/app-error.js';
/**
 * Global error handler middleware.
 * Distinguishes operational errors (AppError) from programming errors.
 */
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
        return;
    }
    // Programming / unexpected error
    console.error('❌ Unexpected Error:', err);
    res.status(500).json({
        message: 'Erro interno do servidor',
    });
}
//# sourceMappingURL=error-handler.js.map