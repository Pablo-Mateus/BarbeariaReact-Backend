import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITenant {
  nome: string;
  slug: string;
  email: string;
  telefone: string;
  endereco?: string;
  logoUrl?: string;
  isActive: boolean;
  configuracoes: {
    timezone: string;
  };
}

export interface ITenantDocument extends ITenant, Document {}

const tenantSchema = new Schema<ITenantDocument>(
  {
    nome: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    endereco: { type: String, trim: true },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: false },
    configuracoes: {
      timezone: { type: String, default: 'America/Sao_Paulo' },
    },
  },
  { timestamps: true }
);


tenantSchema.index({ isActive: 1 });

const Tenant: Model<ITenantDocument> = mongoose.model<ITenantDocument>('Tenant', tenantSchema);

export default Tenant;
