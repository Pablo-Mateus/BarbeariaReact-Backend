import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterInput, LoginInput, ResetPasswordInput, ChangePasswordInput } from './auth.validation.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as RegisterInput;
      const result = await this.authService.register(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.query.token as string;
      const result = await this.authService.confirmEmail(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as LoginInput;
      const result = await this.authService.login(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as ResetPasswordInput;
      const result = await this.authService.resetPassword(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as ChangePasswordInput;
      const result = await this.authService.changePassword(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ isAuthenticated: false, message: 'Não autenticado' });
        return;
      }
      const result = await this.authService.checkAuth(
        req.user.userId,
        req.user.tenantId,
        req.user.role,
        req.user.name
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
