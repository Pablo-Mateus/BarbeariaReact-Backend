import { Request } from 'express';
export type UserRole = 'owner' | 'barber' | 'client';
export type AppointmentStatus = 'Aguardando aceite' | 'Aceito' | 'Cancelado pelo usuário' | 'Concluído';
export interface IJwtPayload {
    userId: string;
    tenantId: string;
    role: UserRole;
    name: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
    tenantId?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export interface TenantConfig {
    defaultStartTime: number;
    defaultEndTime: number;
    defaultInterval: number;
    timezone: string;
}
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
//# sourceMappingURL=index.d.ts.map