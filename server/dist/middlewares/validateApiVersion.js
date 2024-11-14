"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiVersion = void 0;
const validateApiVersion = (req, res, next) => {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || acceptHeader !== 'application/api.rest-v1+json') {
        res.status(400).json({
            code: 400,
            message: "Versioning erroné => vérifiez Accept: application/api.rest-v1+json",
            datas: null,
            warnings: []
        });
        return;
    }
    next();
};
exports.validateApiVersion = validateApiVersion;
//# sourceMappingURL=validateApiVersion.js.map