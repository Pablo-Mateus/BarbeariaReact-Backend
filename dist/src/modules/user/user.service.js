import { NotFoundError } from '../../shared/errors/app-error.js';
export class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUsersByTenant(tenantId) {
        return this.userRepository.findAll(tenantId);
    }
    async getClientsByTenant(tenantId) {
        return this.userRepository.findByRole(tenantId, 'client');
    }
    async getBarbersByTenant(tenantId) {
        return this.userRepository.findByRole(tenantId, 'barber');
    }
    async updateUser(tenantId, userId, data) {
        const user = await this.userRepository.updateById(tenantId, userId, { $set: data });
        if (!user) {
            throw new NotFoundError('Usuário');
        }
        return user;
    }
}
//# sourceMappingURL=user.service.js.map