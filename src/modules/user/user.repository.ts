import User, { IUserDocument } from './user.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
import { FilterQuery } from 'mongoose';

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(tenantId: string, email: string): Promise<IUserDocument | null> {
    return this.findOne(tenantId, { email } as FilterQuery<IUserDocument>);
  }

  async findByConfirmToken(token: string): Promise<IUserDocument | null> {
    return User.findOne({
      confirmToken: token,
      confirmTokenExpire: { $gt: Date.now() },
    }).exec();
  }

  async findByConfirmTokenAny(token: string): Promise<IUserDocument | null> {
    return User.findOne({ confirmToken: token }).exec();
  }

  async findByResetToken(token: string): Promise<IUserDocument | null> {
    return User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    }).exec();
  }

  async findByRole(tenantId: string, role: string): Promise<IUserDocument[]> {
    return this.findAll(tenantId, { role } as FilterQuery<IUserDocument>);
  }
}
