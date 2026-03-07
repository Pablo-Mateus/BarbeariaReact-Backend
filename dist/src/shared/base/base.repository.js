/**
 * Base repository that enforces tenant isolation at the data access layer.
 * Every query automatically includes tenantId, making cross-tenant data access impossible.
 *
 * All module-specific repositories extend this class to inherit tenant-scoped operations.
 */
export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findAll(tenantId, filter = {}) {
        return this.model.find({ ...filter, tenantId }).exec();
    }
    async findById(tenantId, id) {
        return this.model.findOne({ _id: id, tenantId }).exec();
    }
    async findOne(tenantId, filter) {
        return this.model.findOne({ ...filter, tenantId }).exec();
    }
    async create(data) {
        const doc = new this.model(data);
        return doc.save();
    }
    async updateById(tenantId, id, data) {
        return this.model
            .findOneAndUpdate({ _id: id, tenantId }, data, { new: true })
            .exec();
    }
    async updateMany(tenantId, filter, data) {
        const result = await this.model
            .updateMany({ ...filter, tenantId }, data)
            .exec();
        return result.modifiedCount;
    }
    async deleteById(tenantId, id) {
        const result = await this.model
            .deleteOne({ _id: id, tenantId })
            .exec();
        return result.deletedCount > 0;
    }
    async deleteMany(tenantId, filter) {
        const result = await this.model
            .deleteMany({ ...filter, tenantId })
            .exec();
        return result.deletedCount;
    }
    async count(tenantId, filter = {}) {
        return this.model.countDocuments({ ...filter, tenantId }).exec();
    }
}
//# sourceMappingURL=base.repository.js.map