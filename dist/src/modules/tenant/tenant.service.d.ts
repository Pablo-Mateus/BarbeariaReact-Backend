import { TenantRepository } from './tenant.repository.js';
import { ITenantDocument } from './tenant.model.js';
import { CreateTenantInput, UpdateTenantInput } from './tenant.validation.js';
export declare class TenantService {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    createTenant(data: CreateTenantInput): Promise<ITenantDocument>;
    getTenantBySlug(slug: string): Promise<ITenantDocument>;
    getTenantById(id: string): Promise<ITenantDocument>;
    listTenants(): Promise<ITenantDocument[]>;
    updateTenant(id: string, data: UpdateTenantInput): Promise<ITenantDocument>;
}
//# sourceMappingURL=tenant.service.d.ts.map