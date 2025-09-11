"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.ts
const express_1 = require("express");
const controller_1 = __importDefault(require("../controllers/controller")); // <- named import
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.get("/health", (req, res) => {
    res
        .status(200)
        .json({ error: false, message: "User Routes Health Check Successfull" });
});
router.post("/login", controller_1.default.login);
router.post("/buy-ticket", authMiddleware_1.default, controller_1.default.buyTicket);
router.get("/user-tickets", authMiddleware_1.default, controller_1.default.getMyTickets);
router.get("/get-all-users", controller_1.default.getAllUsers);
// router.get("/users", controller.getAllUsers);
//for referral system
router.post("/send-referral", authMiddleware_1.default, controller_1.default.referral);
router.get("/get-referral-data", authMiddleware_1.default, controller_1.default.getReferalData);
exports.default = router;
