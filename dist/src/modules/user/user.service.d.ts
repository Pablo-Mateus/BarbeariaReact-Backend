import { UserRepository } from './user.repository.js';
import { IUserDocument } from './user.model.js';
import { UpdateUserInput } from './user.validation.js';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getUsersByTenant(tenantId: string): Promise<IUserDocument[]>;
    getClientsByTenant(tenantId: string): Promise<IUserDocument[]>;
    getBarbersByTenant(tenantId: string): Promise<IUserDocument[]>;
    updateUser(tenantId: string, userId: string, data: UpdateUserInput): Promise<IUserDocument>;
}
//# sourceMappingURL=user.service.d.ts.map