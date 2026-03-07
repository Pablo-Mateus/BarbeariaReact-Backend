import mongoose, { Schema } from 'mongoose';
const agendadoSchema = new Schema({
    dia: { type: String, required: true },
    nome: { type: String, required: true },
    servico: { type: String, required: true },
    horario: { type: String, required: true },
    termino: { type: String },
    tempo: { type: String, required: true },
    status: { type: String, required: true },
    horarios: { type: [String], default: [] },
    horariosMinutos: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
});
const Agendado = mongoose.model('Agendado', agendadoSchema);
export default Agendado;
//# sourceMappingURL=Agendado.js.map