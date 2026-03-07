import { ConflictError, NotFoundError } from '../../shared/errors/app-error.js';
export class TenantService {
    tenantRepository;
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async createTenant(data) {
        const slugExists = await this.tenantRepository.existsBySlug(data.slug);
        if (slugExists) {
            throw new ConflictError('Já existe uma barbearia com este slug');
        }
        return this.tenantRepository.create({
            ...data,
            isActive: true,
            configuracoes: {
                timezone: 'America/Sao_Paulo',
            },
        });
    }
    async getTenantBySlug(slug) {
        const tenant = await this.tenantRepository.findBySlug(slug);
        if (!tenant) {
            throw new NotFoundError('Barbearia');
        }
        return tenant;
    }
    async getTenantById(id) {
        const tenant = await this.tenantRepository.findById(id);
        if (!tenant) {
            throw new NotFoundError('Barbearia');
        }
        return tenant;
    }
    async listTenants() {
        return this.tenantRepository.findAll();
    }
    async updateTenant(id, data) {
        if (data.slug) {
            const existing = await this.tenantRepository.findBySlug(data.slug);
            if (existing && existing._id.toString() !== id) {
                throw new ConflictError('Já existe uma barbearia com este slug');
            }
        }
        const tenant = await this.tenantRepository.updateById(id, data);
        if (!tenant) {
            throw new NotFoundError('Barbearia');
        }
        return tenant;
    }
}
//# sourceMappingURL=tenant.service.js.map