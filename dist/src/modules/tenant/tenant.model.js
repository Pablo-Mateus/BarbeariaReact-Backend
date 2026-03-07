import mongoose, { Schema } from 'mongoose';
const tenantSchema = new Schema({
    nome: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    endereco: { type: String, trim: true },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
    configuracoes: {
        timezone: { type: String, default: 'America/Sao_Paulo' },
    },
}, { timestamps: true });
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ isActive: 1 });
const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;
//# sourceMappingURL=tenant.model.js.map