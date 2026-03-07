export class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenant = await this.tenantService.createTenant(data);
            res.status(201).json({ message: 'Barbearia criada com sucesso', data: tenant });
        }
        catch (error) {
            next(error);
        }
    };
    getBySlug = async (req, res, next) => {
        try {
            const tenant = await this.tenantService.getTenantBySlug(req.params.slug);
            res.status(200).json({ data: tenant });
        }
        catch (error) {
            next(error);
        }
    };
    list = async (_req, res, next) => {
        try {
            const tenants = await this.tenantService.listTenants();
            res.status(200).json({ data: tenants });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const data = req.body;
            const tenant = await this.tenantService.updateTenant(req.tenantId, data);
            res.status(200).json({ message: 'Barbearia atualizada com sucesso', data: tenant });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=tenant.controller.js.map