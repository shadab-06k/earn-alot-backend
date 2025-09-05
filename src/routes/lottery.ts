import { Router } from "express";
import { connectWallet } from "../services/ton";
import { deployLotteryToTestnet } from "../services/deploy";
import poolController from "../controllers/poolController";

const router = Router();

router.post("/connect", async (req, res) => {
  try {
    const { address } = req.body;
    const result = await connectWallet(address);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/deploy", async (req, res) => {
  try {
    const tx = await deployLotteryToTestnet(req.body);
    if (!tx) {
      return res.status(400).json({ success: false, error: "Failed to build deployment transaction" });
    }
    res.json({ success: true, tx, message: "Deployment transaction built successfully!" });

  } catch (err: any) {
    console.error("Deploy error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create pool endpoint that deploys contract and saves to database
router.post("/create-pool", async (req, res) => {
  try {
    // Use the pool controller to create pool (which will deploy contract first)
    await poolController.createPool(req, res);
  } catch (err: any) {
    console.error("Create pool error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export = router;
