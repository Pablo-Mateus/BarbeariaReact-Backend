import { ZodError } from 'zod';
/**
 * Middleware factory for request validation using Zod schemas.
 * Validates body, params, and/or query against provided schemas.
 * Replaces req properties with parsed (sanitized) values.
 *
 * Usage: validate({ body: createAppointmentSchema })
 */
export function validate(schemas) {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((e) => {
                    const path = e.path.map(String).join('.');
                    return path ? `${path}: ${e.message}` : e.message;
                });
                res.status(422).json({
                    message: 'Dados inválidos',
                    errors: messages,
                });
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map