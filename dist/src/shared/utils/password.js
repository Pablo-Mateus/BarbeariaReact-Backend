import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
//# sourceMappingURL=password.js.map