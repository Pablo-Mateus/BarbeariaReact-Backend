import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'debug.log');
function logToFile(msg: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}

/**
 * Base repository that enforces tenant isolation at the data access layer.
 * Every query automatically includes tenantId, making cross-tenant data access impossible.
 * 
 * All module-specific repositories extend this class to inherit tenant-scoped operations.
 */
export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(tenantId: string, filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find({ ...filter, tenantId } as FilterQuery<T>).exec();
  }

  async findById(tenantId: string, id: string): Promise<T | null> {
    return this.model.findOne({ _id: id, tenantId } as FilterQuery<T>).exec();
  }

  async findOne(tenantId: string, filter: FilterQuery<T>): Promise<T | null> {
    const query = { ...filter, tenantId };
    logToFile(`[BaseRepository.findOne] Model: ${this.model.modelName}, Query: ${JSON.stringify(query)}`);
    const result = await this.model.findOne(query as FilterQuery<T>).exec();
    logToFile(`[BaseRepository.findOne] Result found: ${!!result}`);
    return result;
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async updateById(tenantId: string, id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate(
        { _id: id, tenantId } as FilterQuery<T>,
        data,
        { new: true }
      )
      .exec();
  }

  async updateMany(tenantId: string, filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number> {
    const result = await this.model
      .updateMany({ ...filter, tenantId } as FilterQuery<T>, data)
      .exec();
    return result.modifiedCount;
  }

  async deleteById(tenantId: string, id: string): Promise<boolean> {
    const result = await this.model
      .deleteOne({ _id: id, tenantId } as FilterQuery<T>)
      .exec();
    return result.deletedCount > 0;
  }

  async deleteMany(tenantId: string, filter: FilterQuery<T>): Promise<number> {
    const result = await this.model
      .deleteMany({ ...filter, tenantId } as FilterQuery<T>)
      .exec();
    return result.deletedCount;
  }

  async count(tenantId: string, filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments({ ...filter, tenantId } as FilterQuery<T>).exec();
  }
}
