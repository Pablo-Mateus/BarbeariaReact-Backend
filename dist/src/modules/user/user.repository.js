import User from './user.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }
    async findByEmail(tenantId, email) {
        return this.findOne(tenantId, { email });
    }
    async findByConfirmToken(token) {
        return User.findOne({
            confirmToken: token,
            confirmTokenExpire: { $gt: Date.now() },
        }).exec();
    }
    async findByConfirmTokenAny(token) {
        return User.findOne({ confirmToken: token }).exec();
    }
    async findByResetToken(token) {
        return User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        }).exec();
    }
    async findByRole(tenantId, role) {
        return this.findAll(tenantId, { role });
    }
}
//# sourceMappingURL=user.repository.js.map