import { UserRepository } from '../user/user.repository.js';
import { TenantRepository } from '../tenant/tenant.repository.js';
import { RegisterInput, LoginInput, ResetPasswordInput, ChangePasswordInput } from './auth.validation.js';
import { IJwtPayload } from '../../shared/types/index.js';
interface AuthResult {
    token: string;
    redirect: string;
    decoded: IJwtPayload;
    message: string;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly tenantRepository;
    constructor(userRepository: UserRepository, tenantRepository: TenantRepository);
    register(data: RegisterInput): Promise<{
        message: string;
    }>;
    confirmEmail(token: string): Promise<{
        message: string;
    }>;
    login(data: LoginInput): Promise<AuthResult>;
    resetPassword(data: ResetPasswordInput): Promise<{
        message: string;
    }>;
    changePassword(data: ChangePasswordInput): Promise<{
        message: string;
    }>;
    checkAuth(userId: string, _tenantId: string, role: string, name: string): Promise<{
        isAuthenticated: boolean;
        user: string;
        name: {
            name: string;
            role: string;
        };
        isAdmin: boolean;
    }>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map