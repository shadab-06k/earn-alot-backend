"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poolController_1 = __importDefault(require("../controllers/poolController"));
const router = (0, express_1.Router)();
// Public routes
router.get("/get-all-pools", poolController_1.default.getAllPools);
router.get("/get-pool-by-id/:poolId", poolController_1.default.getPoolById);
// Protected routes (admin only)
router.post("/create-pools", poolController_1.default.createPool);
router.put("/pools/:poolId", poolController_1.default.updatePoolStatus);
// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        message: "Pool service is running",
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
