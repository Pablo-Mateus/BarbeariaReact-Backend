export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    listClients = async (req, res, next) => {
        try {
            const clients = await this.userService.getClientsByTenant(req.tenantId);
            // Remove sensitive fields before sending
            const sanitized = clients.map((c) => ({
                _id: c._id,
                nome: c.nome,
                email: c.email,
                telefone: c.telefone,
                role: c.role,
                active: c.active,
            }));
            res.status(200).json({ data: sanitized });
        }
        catch (error) {
            next(error);
        }
    };
    listBarbers = async (req, res, next) => {
        try {
            const barbers = await this.userService.getBarbersByTenant(req.tenantId);
            const sanitized = barbers.map((b) => ({
                _id: b._id,
                nome: b.nome,
                email: b.email,
                telefone: b.telefone,
                role: b.role,
            }));
            res.status(200).json({ data: sanitized });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const data = req.body;
            const user = await this.userService.updateUser(req.tenantId, req.params.id, data);
            res.status(200).json({ message: 'Usuário atualizado', data: { nome: user.nome, role: user.role } });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=user.controller.js.map