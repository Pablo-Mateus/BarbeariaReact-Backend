import { IUserDocument } from './user.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export declare class UserRepository extends BaseRepository<IUserDocument> {
    constructor();
    findByEmail(tenantId: string, email: string): Promise<IUserDocument | null>;
    findByConfirmToken(token: string): Promise<IUserDocument | null>;
    findByConfirmTokenAny(token: string): Promise<IUserDocument | null>;
    findByResetToken(token: string): Promise<IUserDocument | null>;
    findByRole(tenantId: string, role: string): Promise<IUserDocument[]>;
}
//# sourceMappingURL=user.repository.d.ts.map