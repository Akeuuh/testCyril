"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).json({
            code: 401,
            message: "No token provided",
            datas: null,
            warnings: [],
        });
        return;
    }
    if (token) {
        next();
    }
    else {
        res.status(403).json({
            code: 403,
            message: "Invalid token",
            datas: null,
            warnings: [],
        });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map