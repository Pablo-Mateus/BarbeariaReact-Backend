import { Model, Document, Types } from 'mongoose';
import { UserRole } from '../../shared/types/index.js';
export interface IUser {
    tenantId: Types.ObjectId;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    role: UserRole;
    confirmarsenha?: string;
    resetToken?: string;
    resetTokenExpire?: Date;
    confirmToken?: string;
    confirmTokenExpire?: Date;
    active: boolean;
}
export interface IUserDocument extends IUser, Document {
}
declare const User: Model<IUserDocument>;
export default User;
//# sourceMappingURL=user.model.d.ts.map