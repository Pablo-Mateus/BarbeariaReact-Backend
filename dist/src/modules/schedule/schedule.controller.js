export class ScheduleController {
    scheduleService;
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    define = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.scheduleService.defineSchedule(req.tenantId, data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    getTimes = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.scheduleService.getTimes(req.tenantId, data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=schedule.controller.js.map