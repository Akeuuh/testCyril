"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const auth_1 = require("../utils/auth");
const login = (req, res) => {
    const { username, password, code_application, code_version } = req.body;
    if (!username || !password || !code_application || !code_version) {
        res.status(400).json({
            code: 400,
            message: "Missing required parameters",
            datas: null,
            warnings: [],
        });
        return;
    }
    if (username === "test_api" && password === "api123456") {
        const token = (0, auth_1.generateToken)();
        res.status(200).json({
            code: 200,
            message: "",
            datas: { token },
            warnings: [],
        });
        return;
    }
    res.status(401).json({
        code: 401,
        message: "Invalid credentials",
        datas: null,
        warnings: [],
    });
};
exports.login = login;
//# sourceMappingURL=authController.js.map