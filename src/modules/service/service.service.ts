import { ServiceRepository } from './service.repository.js';
import { IServiceDocument } from './service.model.js';
import { CreateServiceInput, UpdateServiceInput } from './service.validation.js';
import { NotFoundError } from '../../shared/errors/app-error.js';
import { Types } from 'mongoose';

export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async createService(tenantId: string, data: CreateServiceInput): Promise<IServiceDocument> {
    return this.serviceRepository.create({
      tenantId: new Types.ObjectId(tenantId),
      ...data,
      isActive: true,
    } as Partial<IServiceDocument>);
  }

  async getActiveServices(tenantId: string): Promise<IServiceDocument[]> {
    return this.serviceRepository.findActiveByTenant(tenantId);
  }

  async getAllServices(tenantId: string): Promise<IServiceDocument[]> {
    return this.serviceRepository.findAll(tenantId);
  }

  async updateService(
    tenantId: string,
    serviceId: string,
    data: UpdateServiceInput
  ): Promise<IServiceDocument> {
    const service = await this.serviceRepository.updateById(tenantId, serviceId, {
      $set: data,
    });
    if (!service) {
      throw new NotFoundError('Serviço');
    }
    return service;
  }

  async deleteService(tenantId: string, serviceId: string): Promise<{ message: string }> {
    const deleted = await this.serviceRepository.deleteById(tenantId, serviceId);
    if (!deleted) {
      throw new NotFoundError('Serviço');
    }
    return { message: 'Serviço removido com sucesso' };
  }
}
