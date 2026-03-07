import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import { apiRateLimiter } from './shared/middleware/rate-limiter.js';
import { errorHandler } from './shared/middleware/error-handler.js';
// Route imports
import tenantRoutes from './modules/tenant/tenant.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import appointmentRoutes from './modules/appointment/appointment.routes.js';
import scheduleRoutes from './modules/schedule/schedule.routes.js';
import serviceRoutes from './modules/service/service.routes.js';
import userRoutes from './modules/user/user.routes.js';
const app = express();
// Security middleware
app.use(helmet());
app.use(corsOptions);
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());
app.use(apiRateLimiter);
// API Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
// Health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global error handler (must be last)
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map