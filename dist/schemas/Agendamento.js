import mongoose, { Schema } from 'mongoose';
const horariosSchema = new Schema({
    diasemana: { type: String, required: true },
    inicio: { type: Number, required: true },
    fim: { type: Number, required: true },
    intervalo: { type: Number, required: true },
    arraydehorarios: { type: [Number], default: [] },
    disponiveis: { type: [Number], default: [] },
});
const Horarios = mongoose.model('Horarios', horariosSchema);
export default Horarios;
//# sourceMappingURL=Agendamento.js.map