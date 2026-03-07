import { NotFoundError } from '../../shared/errors/app-error.js';
import { Types } from 'mongoose';
export class ServiceService {
    serviceRepository;
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    async createService(tenantId, data) {
        return this.serviceRepository.create({
            tenantId: new Types.ObjectId(tenantId),
            ...data,
            isActive: true,
        });
    }
    async getActiveServices(tenantId) {
        return this.serviceRepository.findActiveByTenant(tenantId);
    }
    async getAllServices(tenantId) {
        return this.serviceRepository.findAll(tenantId);
    }
    async updateService(tenantId, serviceId, data) {
        const service = await this.serviceRepository.updateById(tenantId, serviceId, {
            $set: data,
        });
        if (!service) {
            throw new NotFoundError('Serviço');
        }
        return service;
    }
    async deleteService(tenantId, serviceId) {
        const deleted = await this.serviceRepository.deleteById(tenantId, serviceId);
        if (!deleted) {
            throw new NotFoundError('Serviço');
        }
        return { message: 'Serviço removido com sucesso' };
    }
}
//# sourceMappingURL=service.service.js.map