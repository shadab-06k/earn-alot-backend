import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../common/logger";
import { getUserCollection, UserDoc } from "../models/userModel"; // adjust path if needed
import { randomUUID } from "crypto";
import { getClient } from "../connections/connections";
import type { WithId } from "mongodb";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { telegramId, walletAddress, email, userName, maxBetAmount } =
      req.body;

    if (!telegramId || !walletAddress) {
      res
        .status(400)
        .json({ error: "Telegram ID and WalletAddress are required." });
      return;
    }

    const tgId = String(telegramId).trim();
    const wallet = String(walletAddress).trim();
    const normalizedEmail = email
      ? String(email).toLowerCase().trim()
      : undefined;

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Users = getUserCollection(db);

    // Will be WithId<UserDoc> | null
    let user = await Users.findOne({ walletAddress: wallet });

    if (!user) {
      if (!normalizedEmail) {
        res
          .status(400)
          .json({ error: "Email is required for first-time login." });
        return;
      }

      // ensure email not taken
      const emailOwner = await Users.findOne({ email: normalizedEmail });
      if (emailOwner) {
        res.status(409).json({ error: "Email already in use." });
        return;
      }

      const newUser: UserDoc = {
        uniqueID: randomUUID(),
        userName: userName || `TG_${tgId}`,
        email: normalizedEmail,
        walletAddress: wallet,
        telegramId: tgId,
        maxBetAmount: Number(maxBetAmount) || 0,
        lotteryNumbers: [],
        lotteriesPurchased: 0,
        ticketsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await Users.insertOne(newUser);

      // Make `user` a WithId<UserDoc> by attaching `_id`
      user = { ...newUser, _id: insertResult.insertedId } as WithId<UserDoc>;
    }

    const payload = {
      userId: user.uniqueID,
      name: user.userName,
      telegramId: user.telegramId,
      walletAddress: user.walletAddress,
      email: user.email ?? normalizedEmail ?? null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      AuthToken: token,
      user: payload,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      res.status(409).json({ error: `Duplicate ${field}. Must be unique.` });
      return;
    }
    logger.error("Error in login API", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { login };
