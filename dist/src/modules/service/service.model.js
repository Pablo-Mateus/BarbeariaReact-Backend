import mongoose, { Schema } from 'mongoose';
const serviceSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    duracao: { type: Number, required: true },
    preco: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
serviceSchema.index({ tenantId: 1, isActive: 1 });
const Service = mongoose.model('Service', serviceSchema);
export default Service;
//# sourceMappingURL=service.model.js.map