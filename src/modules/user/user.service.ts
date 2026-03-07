import { UserRepository } from './user.repository.js';
import { IUserDocument } from './user.model.js';
import { UpdateUserInput } from './user.validation.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsersByTenant(tenantId: string): Promise<IUserDocument[]> {
    return this.userRepository.findAll(tenantId);
  }

  async getClientsByTenant(tenantId: string): Promise<IUserDocument[]> {
    return this.userRepository.findByRole(tenantId, 'client');
  }

  async getBarbersByTenant(tenantId: string): Promise<IUserDocument[]> {
    return this.userRepository.findByRole(tenantId, 'barber');
  }

  async updateUser(
    tenantId: string,
    userId: string,
    data: UpdateUserInput
  ): Promise<IUserDocument> {
    const user = await this.userRepository.updateById(tenantId, userId, { $set: data });
    if (!user) {
      throw new NotFoundError('Usuário');
    }
    return user;
  }
}
