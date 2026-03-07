export class AppointmentController {
    appointmentService;
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.appointmentService.createAppointment(req.tenantId, req.user, data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    cancel = async (req, res, next) => {
        try {
            const { agendamentoId } = req.body;
            const result = await this.appointmentService.cancelAppointment(req.tenantId, agendamentoId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    confirm = async (req, res, next) => {
        try {
            const { agendamentoId } = req.body;
            const result = await this.appointmentService.confirmAppointment(req.tenantId, agendamentoId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    archive = async (req, res, next) => {
        try {
            const result = await this.appointmentService.archiveCancelled(req.tenantId, req.user.name);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCancelled = async (req, res, next) => {
        try {
            const result = await this.appointmentService.deleteCancelled(req.tenantId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const result = await this.appointmentService.getSchedules(req.tenantId, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    dayAvailability = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.appointmentService.getDayAvailability(req.tenantId, data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=appointment.controller.js.map