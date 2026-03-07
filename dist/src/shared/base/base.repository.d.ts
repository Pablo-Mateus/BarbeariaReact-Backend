import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
/**
 * Base repository that enforces tenant isolation at the data access layer.
 * Every query automatically includes tenantId, making cross-tenant data access impossible.
 *
 * All module-specific repositories extend this class to inherit tenant-scoped operations.
 */
export declare class BaseRepository<T extends Document> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    findAll(tenantId: string, filter?: FilterQuery<T>): Promise<T[]>;
    findById(tenantId: string, id: string): Promise<T | null>;
    findOne(tenantId: string, filter: FilterQuery<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    updateById(tenantId: string, id: string, data: UpdateQuery<T>): Promise<T | null>;
    updateMany(tenantId: string, filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number>;
    deleteById(tenantId: string, id: string): Promise<boolean>;
    deleteMany(tenantId: string, filter: FilterQuery<T>): Promise<number>;
    count(tenantId: string, filter?: FilterQuery<T>): Promise<number>;
}
//# sourceMappingURL=base.repository.d.ts.map