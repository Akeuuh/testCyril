"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientColler_1 = require("../controllers/clientColler");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get("/", clientColler_1.getClients);
router.get("/:id", clientColler_1.getClientById);
router.put("/:id", clientColler_1.updateClient);
exports.default = router;
//# sourceMappingURL=clientRoutes.js.map