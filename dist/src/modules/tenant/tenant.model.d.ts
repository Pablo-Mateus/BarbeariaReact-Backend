import { Model, Document } from 'mongoose';
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
export interface ITenantDocument extends ITenant, Document {
}
declare const Tenant: Model<ITenantDocument>;
export default Tenant;
//# sourceMappingURL=tenant.model.d.ts.map