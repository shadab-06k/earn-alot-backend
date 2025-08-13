import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../common/logger";
import {
  getTicketCollection,
  getUserCollection,
  TicketDoc,
  UserDoc,
} from "../models/userModel"; // adjust path if needed
import { getClient } from "../connections/connections";
import type { WithId } from "mongodb";
import { randomUUID } from "crypto";
interface AuthPayload {
  telegramId: string;
  userName: string;
  uniqueID: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

dotenv.config();

// export const login = async (req: Request, res: Response) => {
//   try {
//     const {
//       telegramId,
//       walletAddress,
//       userName,
//       maxBetAmount,
//       lotteryNumbers,
//       lotteriesPurchased,
//       jackpot,
//       duration,
//       endsIn,
//       poolAmount,
//       date,
//     } = req.body;

//     if (!telegramId || !walletAddress) {
//       res
//         .status(400)
//         .json({ error: "Telegram ID and WalletAddress are required." });
//       return;
//     }

//     const tgId = String(telegramId).trim();
//     const wallet = String(walletAddress).trim();

//     const client = await getClient();
//     const db = client.db(process.env.DB_NAME);
//     const Users = getUserCollection(db);

//     // Will be WithId<UserDoc> | null
//     let user = await Users.findOne({ walletAddress: wallet });
//     console.log("Users available ===", user);
//     if (user) {
//       const payload = {
//         userId: user.uniqueID,
//         name: user.userName,
//         telegramId: user.telegramId,
//         walletAddress: user.walletAddress,
//       };

//       const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
//         expiresIn: "1h",
//       });

//       res.status(200).json({
//         message: "User Already Exists",
//         AuthToken: token,
//       });
//       return;
//     }

//     if (!user) {
//       if (!walletAddress) {
//         res
//           .status(400)
//           .json({ error: "Wallet Address is required for first-time login." });
//         return;
//       }

//       // ensure email not taken
//       const tonWalletOwner = await Users.findOne({ walletAddress: wallet });
//       if (tonWalletOwner) {
//         res.status(409).json({ error: "Ton Wallet Address already in use." });
//         return;
//       }

//       const newUser: UserDoc = {
//         uniqueID: randomUUID(),
//         userName: userName || `TG_${tgId}`,
//         walletAddress: wallet,
//         telegramId: tgId,
//         maxBetAmount: Number(maxBetAmount) || 0,
//         lotteryNumbers:lotteryNumbers,
//         lotteriesPurchased: lotteriesPurchased || 0,
//         jackpot: jackpot || "10000",
//         duration: duration || "4:00:00 HRS",
//         endsIn: endsIn || "4:00:00 HRS",
//         poolAmount: poolAmount || 0,
//         date: date || "12/05/2222",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       const insertResult = await Users.insertOne(newUser);

//       // Make `user` a WithId<UserDoc> by attaching `_id`
//       user = { ...newUser, _id: insertResult.insertedId } as WithId<UserDoc>;
//     }

//     const payload = {
//       userId: user.uniqueID,
//       name: user.userName,
//       telegramId: user.telegramId,
//       walletAddress: user.walletAddress,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({
//       message: "User Created successful!",
//       AuthToken: token,
//       // user: payload,
//     });
//   } catch (error: any) {
//     if (error?.code === 11000) {
//       const field = Object.keys(error.keyPattern || {})[0] || "field";
//       res.status(409).json({ error: `Duplicate ${field}. Must be unique.` });
//       return;
//     }
//     logger.error("Error in login API", { error });
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { telegramId, walletAddress, userName } = req.body;

//     if (!telegramId || !walletAddress || !userName) {
//       return res.status(400).json({
//         error: "telegramId, walletAddress and userName are required.",
//       });
//     }

//     const tgId = String(telegramId).trim();
//     const wallet = String(walletAddress).trim();
//     const name = String(userName).trim();

//     const client = await getClient();
//     const db = client.db(process.env.DB_NAME);
//     const Users = getUserCollection(db);

//     let user = await Users.findOne({ walletAddress: wallet });

//     if (!user) {
//       const now = new Date();
//       const newUser: UserDoc = {
//         uniqueID: randomUUID(),
//         userName: name,
//         walletAddress: wallet,
//         telegramId: tgId,
//         createdAt: now,
//         updatedAt: now,
//       };
//       const ins = await Users.insertOne(newUser);
//       user = { ...newUser, _id: ins.insertedId };
//     } else {
//       await Users.updateOne(
//         { _id: user._id },
//         { $set: { updatedAt: new Date() } }
//       );
//     }

//     // Token with exactly 4 claims
//     const token = jwt.sign(
//       {
//         telegramId: user.telegramId,
//         userName: user.userName,
//         uniqueID: user.uniqueID,
//         walletAddress: user.walletAddress,
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );

//     return res.status(200).json({
//       message: "Login successful",
//       AuthToken: token,
//     });
//   } catch (error) {
//     logger.error("Error in /login", { error });
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const login = async (req: Request, res: Response) => {
  try {
    const { telegramId, walletAddress, userName } = req.body;

    if (!telegramId || !walletAddress || !userName) {
      return res.status(400).json({
        error: "telegramId, walletAddress and userName are required.",
      });
    }

    const tgId = String(telegramId).trim();
    const wallet = String(walletAddress).trim();
    const name = String(userName).trim();

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Users = getUserCollection(db);

    // Look up by both keys
    const [uByWallet, uByTelegram] = await Promise.all([
      Users.findOne({ walletAddress: wallet }),
      Users.findOne({ telegramId: tgId }),
    ]);

    // If both exist but are different users -> conflict
    if (uByWallet && uByTelegram && String(uByWallet._id) !== String(uByTelegram._id)) {
      return res.status(409).json({
        error: "Conflict: this wallet address and Telegram ID belong to different users.",
      });
    }

    // If wallet is taken by another Telegram ID
    if (uByWallet && uByWallet.telegramId !== tgId) {
      return res.status(409).json({
        error: "Wallet address is already in use by another Telegram ID.",
      });
    }

    // If Telegram ID is taken by another wallet
    if (uByTelegram && uByTelegram.walletAddress !== wallet) {
      return res.status(409).json({
        error: "Telegram ID is already in use by another wallet address.",
      });
    }

    // Reuse existing user (by wallet or telegram), else create
    let user = uByWallet || uByTelegram;
    if (!user) {
      const now = new Date();
      const newUser: UserDoc = {
        uniqueID: randomUUID(),
        userName: name,
        walletAddress: wallet,
        telegramId: tgId,
        createdAt: now,
        updatedAt: now,
      };
      const ins = await Users.insertOne(newUser);
      user = { ...newUser, _id: ins.insertedId };
    } else {
      await Users.updateOne({ _id: user._id }, { $set: { updatedAt: new Date() } });
    }

    // Token with exactly 4 claims
    const token = jwt.sign(
      {
        telegramId: user.telegramId,
        userName: user.userName,
        uniqueID: user.uniqueID,
        walletAddress: user.walletAddress,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      AuthToken: token,
    });
  } catch (error: any) {
    // Handle unique index races cleanly
    if (error?.code === 11000) {
      if (error.keyPattern?.walletAddress) {
        return res.status(409).json({ error: "Wallet address already exists." });
      }
      if (error.keyPattern?.telegramId) {
        return res.status(409).json({ error: "Telegram ID already exists." });
      }
      return res.status(409).json({ error: "Duplicate key error." });
    }
    logger.error("Error in /login", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /buy-ticket  (Auth required)
// Body: everything EXCEPT the 4 token fields: { lotteryNumbers, maxBetAmount, jackpot, duration, endsIn, poolAmount, date }
export const buyTicket = async (req: Request, res: Response) => {
  try {
    // derive user from JWT
    // const authed = req.user;
    const authed = (req as any).user as AuthPayload | undefined;
    if (!authed) return res.status(401).json({ error: "Unauthorized" });

    const {
      lotteryNumbers,
      lotteriesPurchased,
      maxBetAmount,
      jackpot,
      duration,
      endsIn,
      poolAmount,
      date,
      // optional: poolId, idempotencyKey
    } = req.body;

    const missing = [
      ["lotteryNumbers", lotteryNumbers],
      ["lotteriesPurchased", lotteriesPurchased],
      ["maxBetAmount", maxBetAmount],
      ["jackpot", jackpot],
      ["duration", duration],
      ["endsIn", endsIn],
      ["poolAmount", poolAmount],
      ["date", date],
    ]
      .filter(
        ([, v]) =>
          v === undefined ||
          v === null ||
          (typeof v === "string" && v.trim() === "")
      )
      .map(([k]) => k);

    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing or empty fields: ${missing.join(", ")}` });
    }

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Tickets = getTicketCollection(db);

    const ticket: TicketDoc = {
      ticketId: randomUUID(),
      userId: authed.uniqueID,
      walletAddress: authed.walletAddress,
      userName: authed.userName,
      telegramId: authed.telegramId,
      lotteryNumbers: Array.isArray(lotteryNumbers)
      ? lotteryNumbers
      : [lotteryNumbers],
      maxBetAmount: Number(maxBetAmount) || 0,
      jackpot: jackpot ?? "10000",
      duration: String(duration),
      endsIn: String(endsIn),
      lotteriesPurchased:lotteriesPurchased|| 0,
      poolAmount: Number(poolAmount) || 0,
      date: String(date),
      purchasedAt: new Date(),
    };

    const ins = await Tickets.insertOne(ticket);

    return res.status(200).json({
      message: "Ticket purchased successfully",
      ticket: { ...ticket, _id: ins.insertedId },
    });
  } catch (error) {
    logger.error("Error in /buy-ticket", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /tickets/mine  (Auth required)
// Returns all tickets for walletAddress in the JWT + a convenience array of only the lottery numbers arrays.
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    // const authed = req.user;
    // if (!authed) return res.status(401).json({ error: "Unauthorized" });
       const authed = (req as any).user as AuthPayload | undefined;
    if (!authed) return res.status(401).json({ error: "Unauthorized" });

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Tickets = getTicketCollection(db);

    const tickets = await Tickets.find({ walletAddress: authed.walletAddress })
      .sort({ purchasedAt: -1 })
      .toArray();

    const lotteryNumbers = tickets.map((t) => t.lotteryNumbers);

    return res.status(200).json({
      walletAddress: authed.walletAddress,
      count: tickets.length,
      lotteryNumbers, // just the arrays
      tickets,        // full docs
    });
  } catch (error) {
    logger.error("Error in /tickets/mine", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const client = await getClient();
//     const db = client.db(process.env.DB_NAME);
//     const userCollection = getUserCollection(db);
//     const users = await userCollection.find({}).toArray();
//     res
//       .status(200)
//       .json({ message: "All Users fetched Sucessfully", data: users });
//   } catch (error) {
//     logger.error("Error in getAllUsers API", { error });
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getUniqueUser = async (req: Request, res: Response) => {
//   try {
//     // authMiddleware should set req.user from the verified JWT
//     const auth = (req as any).user as AuthPayload | undefined;
//     if (!auth?.walletAddress) {
//       res.status(401).json({ error: true, message: "Unauthorized" });
//       return;
//     }

//     const client = await getClient();
//     const db = client.db(process.env.DB_NAME);
//     const Users = getUserCollection(db);

//     const me = (await Users.findOne({
//       walletAddress: auth.walletAddress,
//     })) as WithId<UserDoc> | null;
//     if (!me) {
//       res.status(404).json({ error: true, message: "User not found" });
//       return;
//     }

//     res.status(200).json({ error: false, user: me });
//   } catch (err) {
//     res.status(500).json({ error: true, message: "Internal Server Error" });
//   }
// };

export default { login, buyTicket,getMyTickets };
