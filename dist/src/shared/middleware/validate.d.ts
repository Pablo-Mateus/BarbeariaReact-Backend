import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
interface ValidateOptions {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}
/**
 * Middleware factory for request validation using Zod schemas.
 * Validates body, params, and/or query against provided schemas.
 * Replaces req properties with parsed (sanitized) values.
 *
 * Usage: validate({ body: createAppointmentSchema })
 */
export declare function validate(schemas: ValidateOptions): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map