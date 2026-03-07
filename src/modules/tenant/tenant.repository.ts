import Tenant, { ITenantDocument } from './tenant.model.js';

export class TenantRepository {
  async findBySlug(slug: string): Promise<ITenantDocument | null> {
    return Tenant.findOne({ slug, isActive: true }).exec();
  }

  async findById(id: string): Promise<ITenantDocument | null> {
    return Tenant.findById(id).exec();
  }

  async findAll(): Promise<ITenantDocument[]> {
    return Tenant.find({ isActive: true }).exec();
  }

  async create(data: Partial<ITenantDocument>): Promise<ITenantDocument> {
    const tenant = new Tenant(data);
    return tenant.save();
  }

  async updateById(id: string, data: Partial<ITenantDocument>): Promise<ITenantDocument | null> {
    return Tenant.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await Tenant.countDocuments({ slug }).exec();
    return count > 0;
  }
}
