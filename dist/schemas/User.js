import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    senha: { type: String, required: true },
    confirmarsenha: { type: String },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    confirmToken: { type: String },
    confirmTokenExpire: { type: Date },
    active: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=User.js.map