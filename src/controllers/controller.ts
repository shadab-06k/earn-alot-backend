import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../common/logger";
import {
  getTicketCollection,
  getUserCollection,
  getReferralCollection,
  TicketDoc,
  UserDoc,
  ReferralDoc,
} from "../models/userModel"; // adjust path if needed
import { getPoolCollection } from "../models/poolModel";
import { getClient } from "../connections/connections";
import type { WithId } from "mongodb";
import { randomUUID } from "crypto";
import { 
  calculatePointsForReferral, 
  calculateTotalPointsEarned, 
  getPointsSummary,
  extractReferralCode,
  isValidReferralCode 
} from "../utility/pointsHelper";
interface AuthPayload {
  telegramId: string;
  userName: string;
  uniqueID: string;
  walletAddress: string;
  iat?: number;
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

    let user = await Users.findOne({ walletAddress: wallet });

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
      await Users.updateOne(
        { _id: user._id },
        { $set: { updatedAt: new Date() } }
      );
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
      // { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      AuthToken: token,
    });
  } catch (error) {
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
    console.log("authed", authed);
    if (!authed) return res.status(401).json({ error: "Unauthorized" });

    const {
      contractAddress,
      transactionHash,
      walletAddress,
      telegramId,
      userName,
      lotteryNumbers,
      poolId,
      lotteriesPurchased,
      maxBetAmount,
      // jackpot,
      duration,
      endsIn,
      poolAmount,
      title,
      date,
      // optional: poolId, idempotencyKey
    } = req.body;

    const missing = [
      ["contractAddress", contractAddress],
      ["transactionHash", transactionHash],
      ["walletAddress", walletAddress],
      ["telegramId", telegramId],
      ["userName", userName],
      ["lotteryNumbers", lotteryNumbers],
      ["lotteriesPurchased", lotteriesPurchased],
      ["maxBetAmount", maxBetAmount],
      ["poolId", poolId],
      // ["jackpot", jackpot],
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
      contractAddress:contractAddress,
      userId: authed.uniqueID,
      walletAddress: authed.walletAddress,
      userName: authed.userName,
      telegramId: authed.telegramId,
      lotteryNumbers: Array.isArray(lotteryNumbers)
      ? lotteryNumbers
      : [lotteryNumbers],
      maxBetAmount: Number(maxBetAmount) || 0,
      poolId:poolId,
      // jackpot: jackpot ?? "10000",
      duration: String(duration),
      endsIn: String(endsIn),
      lotteriesPurchased:lotteriesPurchased|| 0,
      poolAmount: Number(poolAmount) || 0,
      title: title || "No Title", 
      transactionHash:transactionHash,
      date: String(date),
      purchasedAt: new Date(),
    };

    // Get pool info first to check remaining tickets
    const Pools = getPoolCollection(db);
    const pool = await Pools.findOne({ poolId: poolId });
    
    if (!pool) {
      return res.status(404).json({ error: "Pool not found" });
    }

    // Count current tickets for this pool (sum of lotteriesPurchased)
    const ticketRecords = await Tickets.find({ poolId: poolId }).toArray();
    const ticketsInPool = ticketRecords.reduce((sum, ticket) => sum + (ticket.lotteriesPurchased || 0), 0);
    const remainingTickets = pool.maxTicket - ticketsInPool;
    
    // Check if there are enough tickets remaining
    const ticketsToPurchase = Number(lotteriesPurchased) || 1;
    if (remainingTickets < ticketsToPurchase) {
      return res.status(400).json({ 
        error: `Not enough tickets available. Remaining: ${remainingTickets}, Requested: ${ticketsToPurchase}`,
        remainingTickets: remainingTickets,
        requestedTickets: ticketsToPurchase,
        isPoolFull: remainingTickets === 0
      });
    }

    const ins = await Tickets.insertOne(ticket);

    // Recalculate after insertion
    const updatedTicketRecords = await Tickets.find({ poolId: poolId }).toArray();
    const updatedTicketsInPool = updatedTicketRecords.reduce((sum, ticket) => sum + (ticket.lotteriesPurchased || 0), 0);
    const updatedRemainingTickets = pool.maxTicket - updatedTicketsInPool;

    return res.status(200).json({
      message: "Ticket purchased successfully",
      ticket: { ...ticket, _id: ins.insertedId },
      poolInfo: {
        poolId: poolId,
        ticketsPurchased: updatedTicketsInPool,
        remainingTickets: updatedRemainingTickets,
        maxTickets: pool.maxTicket,
        isPoolFull: updatedRemainingTickets === 0
      }
    });
  } catch (error) {
    logger.error("Error in buy-ticket", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /pool/:poolId/tickets  (Get ticket count for a pool)
export const getPoolTickets = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;

    if (!poolId) {
      return res.status(400).json({ error: "Pool ID is required" });
    }

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Tickets = getTicketCollection(db);
    const Pools = getPoolCollection(db);

    // Get pool info
    const pool = await Pools.findOne({ poolId: poolId });
    if (!pool) {
      return res.status(404).json({ error: "Pool not found" });
    }

    // Count tickets for this pool
    const ticketRecords = await Tickets.find({ poolId: poolId }).toArray();
    const ticketsPurchased = ticketRecords.reduce((sum, ticket) => sum + (ticket.lotteriesPurchased || 0), 0);
    const remainingTickets = pool.maxTicket - ticketsPurchased;

    return res.status(200).json({
      poolId: poolId,
      maxTickets: pool.maxTicket,
      ticketsPurchased: ticketsPurchased,
      remainingTickets: remainingTickets,
      poolStatus: pool.status,
      isFull: remainingTickets <= 0
    });

  } catch (error) {
    logger.error("Error getting pool tickets", { error });
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const userCollection = getUserCollection(db);
    const users = await userCollection.find({}).toArray();
    res
      .status(200)
      .json({ message: "All Users fetched Sucessfully", data: users });
  } catch (error) {
    logger.error("Error in getAllUsers API", { error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const referral = async (req: Request, res: Response) => {
  try {
    const authed = (req as any).user as AuthPayload | undefined;
    if (!authed) return res.status(401).json({ error: "Unauthorized" });
    
    const { referralCode } = req.body;

    // Validate referral code format
    if (!isValidReferralCode(referralCode)) {
      return res.status(400).json({ message: "Invalid referral code format" });
    }

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const userCollection = getUserCollection(db);
    const referralCollection = getReferralCollection(db);
    
    // Find the referrer user by matching the last 12 digits of uniqueID
    const referrerUser = await userCollection.findOne({ 
      uniqueID: { $regex: `${referralCode}$` } 
    });
    
    if(!referrerUser){
      return res.status(404).json({ message: "User with this referral code not found" });
    }

    // Check if current user is trying to refer themselves
    if (referrerUser.uniqueID === authed.uniqueID) {
      return res.status(400).json({ message: "Cannot refer yourself" });
    }

    // Check if this referral already exists
    const existingReferral = await referralCollection.findOne({
      userId: authed.uniqueID,
      referralCode: referralCode
    });

    if (existingReferral) {
      return res.status(400).json({ message: "You have already used this referral code" });
    }

    // Get referrer's current referral count to calculate points
    const referrerReferrals = await referralCollection.find({ 
      referrerUserId: referrerUser.uniqueID 
    }).toArray();
    
    const currentReferralCount = referrerReferrals.length;
    const nextReferralCount = currentReferralCount + 1;
    
    // Calculate points for this referral
    const pointsCalculation = calculatePointsForReferral(nextReferralCount);
    
    const referralData: ReferralDoc = {
      referralCode: referralCode, // The referrer's code
      points: pointsCalculation.points,
      userId: authed.uniqueID, // The user who is being referred
      referrerUserId: referrerUser.uniqueID, // The user who referred
      referrerWalletAddress: referrerUser.walletAddress,
      referrerUserName: referrerUser.userName,
      referrerTelegramId: referrerUser.telegramId,
      walletAddress: authed.walletAddress,
      userName: authed.userName,
      telegramId: authed.telegramId,
      createdAt: new Date(),
    };

    // Save referral data to database
    await referralCollection.insertOne(referralData);

    // Get updated points summary for the referrer
    const pointsSummary = getPointsSummary(nextReferralCount);

    // Send response to the referrer (the person who shared the link)
    // We need to get the referrer's JWT token or send notification to them
    // For now, we'll return success to the referred user but log the referrer's info
    
    res.status(200).json({ 
      message: "Referral used successfully", 
      success: true,
      referredUser: {
        userName: authed.userName,
        uniqueID: authed.uniqueID
      },
      referrerUser: {
        userName: referrerUser.userName,
        uniqueID: referrerUser.uniqueID,
        referralCode: referralCode
      },
      pointsEarnedByReferrer: pointsCalculation.points,
      referrerTotalPoints: pointsCalculation.totalPoints
    });
  } catch (error) {
    console.error("Error in referral API:", error);
    logger.error("Error in referral API", { error });
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}


export const getReferalData = async (req: Request, res: Response) => {
  try {
    const authed = (req as any).user as AuthPayload | undefined;
    if (!authed) return res.status(401).json({ error: "Unauthorized" });
    
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const userCollection = getUserCollection(db);
    const referralCollection = getReferralCollection(db);
    const ticketCollection = getTicketCollection(db);
    
    // Get the last 12 digits from the authenticated user's uniqueID
    const userReferralCode = authed.uniqueID.slice(-12);
    
    // Find all referral records where this user shared the link (earned points)
    const referralRecords = await referralCollection.find({ 
      userId: authed.uniqueID 
    }).toArray();
    
    // Also find referrals where this user used someone's link (to show who referred them)
    const referredByRecords = await referralCollection.find({ 
      referrerUserId: authed.uniqueID 
    }).toArray();
    
    // Get details of users who used this user's referral code
    const referredUsers = [];
    
    for (const record of referralRecords) {
      // Find the user who used this user's referral code
      const referredUser = await userCollection.findOne({ 
        uniqueID: record.referrerUserId 
      });
      
      if (referredUser) {
        // Check if this user has made at least one lottery purchase
        const hasPurchased = await ticketCollection.findOne({ 
          userId: referredUser.uniqueID 
        });
        
        referredUsers.push({
          userName: referredUser.userName,
          uniqueID: referredUser.uniqueID,
          walletAddress: referredUser.walletAddress,
          telegramId: referredUser.telegramId,
          joinedAt: referredUser.createdAt,
          hasPurchasedLottery: !!hasPurchased,
          pointsEarned: record.points,
          referralDate: record.createdAt
        });
      }
    }
    
    // Calculate total points earned using points helper
    const totalReferrals = referredUsers.length;
    const pointsSummary = getPointsSummary(totalReferrals);
    
    // Get who referred this user
    let referredByUser = null;
    if (referredByRecords.length > 0) {
      const referrerRecord = referredByRecords[0]; // Get the first referral record
      referredByUser = {
        userName: referrerRecord.userName,
        uniqueID: referrerRecord.userId,
        referralCode: referrerRecord.referralCode
      };
    }
    
    res.status(200).json({ 
      message: "Referral data fetched successfully", 
      data: {
        currentUser: {
          userName: authed.userName,
          uniqueID: authed.uniqueID,
          referralCode: userReferralCode,
          referralLink: `https://t.me/earn_alot_bot/${userReferralCode}`,
          totalPoints: pointsSummary.totalPointsEarned,
          totalReferrals: totalReferrals
        },
        // referredByUser: referredByUser, // Who referred this user
        referredUsers: referredUsers.map(user => ({
          referredUser: {
            userName: user.userName,
            uniqueID: user.uniqueID,
            totalPoints: 0
          },
          // referrerUser: {
          //   userName: authed.userName,
          //   uniqueID: authed.uniqueID,
          //   referralCode: userReferralCode,
          //   totalPoints: user.pointsEarned
          // }
        }))
      }
    });
  } catch (error) {
    logger.error("Error in getReferalData API", { error });
    res.status(500).json({ message: "Internal Server Error" });
  }
}



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

export default { login, buyTicket, getMyTickets, getPoolTickets, getAllUsers, referral, getReferalData };
