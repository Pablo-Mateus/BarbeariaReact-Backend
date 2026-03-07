import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IService {
  tenantId: Types.ObjectId;
  titulo: string;
  descricao: string;
  duracao: number;
  preco: number;
  isActive: boolean;
}

export interface IServiceDocument extends IService, Document {}

const serviceSchema = new Schema<IServiceDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    duracao: { type: Number, required: true },
    preco: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ tenantId: 1, isActive: 1 });

const Service: Model<IServiceDocument> = mongoose.model<IServiceDocument>('Service', serviceSchema);

export default Service;
