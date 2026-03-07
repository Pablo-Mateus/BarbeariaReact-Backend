import { ITenantDocument } from './tenant.model.js';
export declare class TenantRepository {
    findBySlug(slug: string): Promise<ITenantDocument | null>;
    findById(id: string): Promise<ITenantDocument | null>;
    findAll(): Promise<ITenantDocument[]>;
    create(data: Partial<ITenantDocument>): Promise<ITenantDocument>;
    updateById(id: string, data: Partial<ITenantDocument>): Promise<ITenantDocument | null>;
    existsBySlug(slug: string): Promise<boolean>;
}
//# sourceMappingURL=tenant.repository.d.ts.map