import jwt from 'jsonwebtoken';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Acesso negado. Token não fornecido' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Token inválido ou expirado' });
        return;
    }
};
export default authenticateToken;
//# sourceMappingURL=auth.js.map