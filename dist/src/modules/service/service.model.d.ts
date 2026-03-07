import { Model, Document, Types } from 'mongoose';
export interface IService {
    tenantId: Types.ObjectId;
    titulo: string;
    descricao: string;
    duracao: number;
    preco: number;
    isActive: boolean;
}
export interface IServiceDocument extends IService, Document {
}
declare const Service: Model<IServiceDocument>;
export default Service;
//# sourceMappingURL=service.model.d.ts.map