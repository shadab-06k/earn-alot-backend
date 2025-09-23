// routes/user.ts
import { Router } from "express";
import controller from "../controllers/controller"; // <- named import

const router = Router();

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ error: false, message: "User Routes Health Check Successfull" });
});

router.post("/login", controller.login);
router.post("/buy-ticket", controller.buyTicket);
router.get("/user-tickets", controller.getMyTickets);
router.get("/get-all-users", controller.getAllUsers);
router.post("/claim-bnb-ticket", controller.claimBnbTicket);
// router.get("/users", controller.getAllUsers);
//for referral system

router.post("/send-referral", controller.referral);
router.get("/get-referral-data", controller.getReferalData);


export default router;
