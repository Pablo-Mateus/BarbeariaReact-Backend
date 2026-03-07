import cors from 'cors';
import { env } from './env.js';
export const corsOptions = cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
//# sourceMappingURL=cors.js.map