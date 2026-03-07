import mongoose, { Schema, Model, Document, Types } from 'mongoose';
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

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefone: { type: String, required: true, trim: true },
    senha: { type: String, required: true },
    role: {
      type: String,
      enum: ['owner', 'barber', 'client'],
      required: true,
      default: 'client',
    },
    confirmarsenha: { type: String },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    confirmToken: { type: String },
    confirmTokenExpire: { type: Date },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index: email unique per tenant
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ confirmToken: 1 });
userSchema.index({ resetToken: 1 });

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export default User;
