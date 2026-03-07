export class ServiceController {
    serviceService;
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const service = await this.serviceService.createService(req.tenantId, data);
            res.status(201).json({ message: 'Serviço criado com sucesso', data: service });
        }
        catch (error) {
            next(error);
        }
    };
    listActive = async (req, res, next) => {
        try {
            const services = await this.serviceService.getActiveServices(req.tenantId);
            res.status(200).json({ data: services });
        }
        catch (error) {
            next(error);
        }
    };
    listAll = async (req, res, next) => {
        try {
            const services = await this.serviceService.getAllServices(req.tenantId);
            res.status(200).json({ data: services });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const data = req.body;
            const service = await this.serviceService.updateService(req.tenantId, req.params.id, data);
            res.status(200).json({ message: 'Serviço atualizado', data: service });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const result = await this.serviceService.deleteService(req.tenantId, req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=service.controller.js.map