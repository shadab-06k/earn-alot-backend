import { Router } from "express";
import poolController from "../controllers/poolController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/get-all-pools", poolController.getAllPools);
router.get("/get-pool-by-id/:poolId", poolController.getPoolById);

// Protected routes (admin only)
router.post("/create-pools", poolController.createPool);
router.put("/pools/:poolId", poolController.updatePoolStatus);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    message: "Pool service is running",
    timestamp: new Date().toISOString()
  });
});

export default router;
