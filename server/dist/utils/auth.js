"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map