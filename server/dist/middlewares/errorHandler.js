"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code: 500,
        message: "Internal server error",
        datas: null,
        warnings: [],
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map