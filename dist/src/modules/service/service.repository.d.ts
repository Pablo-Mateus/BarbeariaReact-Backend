import { IServiceDocument } from './service.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export declare class ServiceRepository extends BaseRepository<IServiceDocument> {
    constructor();
    findActiveByTenant(tenantId: string): Promise<IServiceDocument[]>;
}
//# sourceMappingURL=service.repository.d.ts.map