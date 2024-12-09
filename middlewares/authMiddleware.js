const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
    next();
};

module.exports = { authMiddleware, checkRole };
