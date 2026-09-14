const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
exports.isAuthenticated = async (req, res, next) => {
    try {
        const authorization = req.get("Authorization");
        const [scheme, token] = authorization ? authorization.split(" ") : [];
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        req.user = { ...user, _id: user.id };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
};

exports.requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
};