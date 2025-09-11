"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const ton_1 = require("../services/ton");
const deploy_1 = require("../services/deploy");
const poolController_1 = __importDefault(require("../controllers/poolController"));
const router = (0, express_1.Router)();
router.post("/connect", async (req, res) => {
    try {
        const { address } = req.body;
        const result = await (0, ton_1.connectWallet)(address);
        res.json({ success: true, result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.post("/deploy", async (req, res) => {
    try {
        const tx = await (0, deploy_1.deployLotteryToTestnet)(req.body);
        if (!tx) {
            return res.status(400).json({ success: false, error: "Failed to build deployment transaction" });
        }
        res.json({ success: true, tx, message: "Deployment transaction built successfully!" });
    }
    catch (err) {
        console.error("Deploy error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
// Create pool endpoint that deploys contract and saves to database
router.post("/create-pool", async (req, res) => {
    try {
        // Use the pool controller to create pool (which will deploy contract first)
        await poolController_1.default.createPool(req, res);
    }
    catch (err) {
        console.error("Create pool error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
module.exports = router;
