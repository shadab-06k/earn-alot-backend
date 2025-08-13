// routes/user.ts
import { Router } from "express";
import controller from "../controllers/controller"; // <- named import
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ error: false, message: "User Routes Health Check Successfull" });
});

router.post("/login", controller.login);
router.post("/buy-ticket", authMiddleware, controller.buyTicket);
router.get("/unique/user", authMiddleware, controller.getMyTickets);
// router.get("/users", controller.getAllUsers);

export default router;
