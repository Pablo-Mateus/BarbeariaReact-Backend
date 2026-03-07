import { Response, NextFunction } from 'express';
import { ServiceService } from './service.service.js';
import { CreateServiceInput, UpdateServiceInput } from './service.validation.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';

export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateServiceInput;
      const service = await this.serviceService.createService(req.tenantId!, data);
      res.status(201).json({ message: 'Serviço criado com sucesso', data: service });
    } catch (error) {
      next(error);
    }
  };

  listActive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const services = await this.serviceService.getActiveServices(req.tenantId!);
      res.status(200).json({ data: services });
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const services = await this.serviceService.getAllServices(req.tenantId!);
      res.status(200).json({ data: services });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as UpdateServiceInput;
      const service = await this.serviceService.updateService(
        req.tenantId!,
        req.params.id as string,
        data
      );
      res.status(200).json({ message: 'Serviço atualizado', data: service });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.serviceService.deleteService(req.tenantId!, req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
