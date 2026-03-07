import Service, { IServiceDocument } from './service.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
import { FilterQuery } from 'mongoose';

export class ServiceRepository extends BaseRepository<IServiceDocument> {
  constructor() {
    super(Service);
  }

  async findActiveByTenant(tenantId: string): Promise<IServiceDocument[]> {
    return this.findAll(tenantId, { isActive: true } as FilterQuery<IServiceDocument>);
  }
}
