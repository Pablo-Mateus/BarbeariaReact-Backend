import Tenant from './tenant.model.js';
export class TenantRepository {
    async findBySlug(slug) {
        return Tenant.findOne({ slug: slug.toLowerCase(), isActive: true }).exec();
    }
    async findById(id) {
        return Tenant.findById(id).exec();
    }
    async findAll() {
        return Tenant.find({ isActive: true }).exec();
    }
    async create(data) {
        const tenant = new Tenant(data);
        return tenant.save();
    }
    async updateById(id, data) {
        return Tenant.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async existsBySlug(slug) {
        const count = await Tenant.countDocuments({ slug }).exec();
        return count > 0;
    }
}
//# sourceMappingURL=tenant.repository.js.map