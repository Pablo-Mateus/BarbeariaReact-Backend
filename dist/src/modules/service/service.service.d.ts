import { ServiceRepository } from './service.repository.js';
import { IServiceDocument } from './service.model.js';
import { CreateServiceInput, UpdateServiceInput } from './service.validation.js';
export declare class ServiceService {
    private readonly serviceRepository;
    constructor(serviceRepository: ServiceRepository);
    createService(tenantId: string, data: CreateServiceInput): Promise<IServiceDocument>;
    getActiveServices(tenantId: string): Promise<IServiceDocument[]>;
    getAllServices(tenantId: string): Promise<IServiceDocument[]>;
    updateService(tenantId: string, serviceId: string, data: UpdateServiceInput): Promise<IServiceDocument>;
    deleteService(tenantId: string, serviceId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=service.service.d.ts.map