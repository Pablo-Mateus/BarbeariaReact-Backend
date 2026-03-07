import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service.js';
import { CreateTenantInput, UpdateTenantInput } from './tenant.validation.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';

export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateTenantInput;
      const tenant = await this.tenantService.createTenant(data);
      res.status(201).json({ message: 'Barbearia criada com sucesso', data: tenant });
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenant = await this.tenantService.getTenantBySlug(req.params.slug as string);
      res.status(200).json({ data: tenant });
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenants = await this.tenantService.listTenants();
      res.status(200).json({ data: tenants });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as UpdateTenantInput;
      const tenant = await this.tenantService.updateTenant(req.tenantId!, data);
      res.status(200).json({ message: 'Barbearia atualizada com sucesso', data: tenant });
    } catch (error) {
      next(error);
    }
  };
}
