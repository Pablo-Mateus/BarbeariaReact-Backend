import { Request } from 'express';


// Roles available in the system
export type UserRole = 'owner' | 'barber' | 'client';

// Appointment statuses
export type AppointmentStatus = 'Aguardando aceite' | 'Aceito' | 'Cancelado pelo usuário' | 'Concluído';

// JWT payload stored in token
export interface IJwtPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  name: string;
  iat?: number;
  exp?: number;
}

// Extended Express Request with tenant + user context
export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
  tenantId?: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Tenant configuration
export interface TenantConfig {
  defaultStartTime: number; // in minutes from midnight
  defaultEndTime: number;
  defaultInterval: number;
  timezone: string;
}

// Email send options
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
