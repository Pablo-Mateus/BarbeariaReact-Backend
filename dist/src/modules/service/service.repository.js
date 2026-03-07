import Service from './service.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export class ServiceRepository extends BaseRepository {
    constructor() {
        super(Service);
    }
    async findActiveByTenant(tenantId) {
        return this.findAll(tenantId, { isActive: true });
    }
}
//# sourceMappingURL=service.repository.js.map