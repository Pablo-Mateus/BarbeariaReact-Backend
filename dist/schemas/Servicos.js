import mongoose, { Schema } from 'mongoose';
const servicoSchema = new Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    duracao: { type: Number, required: true },
    preco: { type: Number, required: true },
});
const Servico = mongoose.model('Servico', servicoSchema);
export default Servico;
//# sourceMappingURL=Servicos.js.map