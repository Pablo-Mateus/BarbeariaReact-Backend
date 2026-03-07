export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.authService.register(data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    confirmEmail = async (req, res, next) => {
        try {
            const token = req.query.token;
            const result = await this.authService.confirmEmail(token);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.authService.login(data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.authService.resetPassword(data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    changePassword = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.authService.changePassword(data);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    checkAuth = async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({ isAuthenticated: false, message: 'Não autenticado' });
                return;
            }
            const result = await this.authService.checkAuth(req.user.userId, req.user.tenantId, req.user.role, req.user.name);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=auth.controller.js.map