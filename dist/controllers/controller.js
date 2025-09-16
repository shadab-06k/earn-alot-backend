"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferalData = exports.referral = exports.getMyTickets = exports.getPoolTickets = exports.buyTicket = exports.login = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../common/logger"));
const userModel_1 = require("../models/userModel"); // adjust path if needed
const poolModel_1 = require("../models/poolModel");
const connections_1 = require("../connections/connections");
const crypto_1 = require("crypto");
const pointsHelper_1 = require("../utility/pointsHelper");
dotenv_1.default.config();
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
const login = async (req, res) => {
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
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Users = (0, userModel_1.getUserCollection)(db);
        let user = await Users.findOne({ walletAddress: wallet });
        if (!user) {
            const now = new Date();
            const newUser = {
                uniqueID: (0, crypto_1.randomUUID)(),
                userName: name,
                walletAddress: wallet,
                telegramId: tgId,
                createdAt: now,
                updatedAt: now,
            };
            const ins = await Users.insertOne(newUser);
            user = { ...newUser, _id: ins.insertedId };
        }
        else {
            await Users.updateOne({ _id: user._id }, { $set: { updatedAt: new Date() } });
        }
        return res.status(200).json({
            message: "Login successful",
            user: {
                userName: user.userName,
                uniqueID: user.uniqueID,
                walletAddress: user.walletAddress,
                telegramId: user.telegramId
            }
        });
    }
    catch (error) {
        logger_1.default.error("Error in /login", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.login = login;
// POST /buy-ticket  (Wallet address in header required)
// Body: everything EXCEPT the wallet address: { lotteryNumbers, maxBetAmount, jackpot, duration, endsIn, poolAmount, date }
const buyTicket = async (req, res) => {
    try {
        // Get wallet address from header
        const walletAddress = req.headers['wallet-address'];
        if (!walletAddress)
            return res.status(401).json({ error: "Wallet address required in header" });
        // Get user from database using wallet address
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Users = (0, userModel_1.getUserCollection)(db);
        const user = await Users.findOne({ walletAddress });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const { contractAddress, transactionHash, lotteryNumbers, poolId, lotteriesPurchased, maxBetAmount, 
        // jackpot,
        duration, endsIn, poolAmount, title, date,
        // optional: poolId, idempotencyKey
         } = req.body;
        const missing = [
            ["contractAddress", contractAddress],
            ["transactionHash", transactionHash],
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
            .filter(([, v]) => v === undefined ||
            v === null ||
            (typeof v === "string" && v.trim() === ""))
            .map(([k]) => k);
        if (missing.length) {
            return res
                .status(400)
                .json({ error: `Missing or empty fields: ${missing.join(", ")}` });
        }
        const Tickets = (0, userModel_1.getTicketCollection)(db);
        const ticket = {
            ticketId: (0, crypto_1.randomUUID)(),
            contractAddress: contractAddress,
            userId: user.uniqueID,
            walletAddress: user.walletAddress,
            userName: user.userName,
            telegramId: user.telegramId,
            lotteryNumbers: Array.isArray(lotteryNumbers)
                ? lotteryNumbers
                : [lotteryNumbers],
            maxBetAmount: Number(maxBetAmount) || 0,
            poolId: poolId,
            // jackpot: jackpot ?? "10000",
            duration: String(duration),
            endsIn: String(endsIn),
            lotteriesPurchased: Number(lotteriesPurchased) || 0,
            poolAmount: Number(poolAmount) || 0,
            title: title || "No Title",
            transactionHash: transactionHash,
            date: String(date),
            purchasedAt: new Date(),
        };
        // Get pool info first to check remaining tickets
        const Pools = (0, poolModel_1.getPoolCollection)(db);
        const pool = await Pools.findOne({ poolId: poolId });
        if (!pool) {
            return res.status(404).json({ error: "Pool not found" });
        }
        // Count current tickets for this pool (sum of lotteriesPurchased)
        const ticketRecords = await Tickets.find({ poolId: poolId }).toArray();
        const ticketsInPool = ticketRecords.reduce((sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0), 0);
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
        const updatedTicketsInPool = updatedTicketRecords.reduce((sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0), 0);
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
    }
    catch (error) {
        logger_1.default.error("Error in buy-ticket", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.buyTicket = buyTicket;
// GET /pool/:poolId/tickets  (Get ticket count for a pool)
const getPoolTickets = async (req, res) => {
    try {
        const { poolId } = req.params;
        if (!poolId) {
            return res.status(400).json({ error: "Pool ID is required" });
        }
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Tickets = (0, userModel_1.getTicketCollection)(db);
        const Pools = (0, poolModel_1.getPoolCollection)(db);
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
    }
    catch (error) {
        logger_1.default.error("Error getting pool tickets", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getPoolTickets = getPoolTickets;
// GET /tickets/mine  (Wallet address in header required)
// Returns all tickets for walletAddress in the header + a convenience array of only the lottery numbers arrays.
const getMyTickets = async (req, res) => {
    try {
        // Get wallet address from header
        const walletAddress = req.headers['wallet-address'];
        if (!walletAddress)
            return res.status(401).json({ error: "Wallet address required in header" });
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Tickets = (0, userModel_1.getTicketCollection)(db);
        const tickets = await Tickets.find({ walletAddress })
            .sort({ purchasedAt: -1 })
            .toArray();
        const lotteryNumbers = tickets.map((t) => t.lotteryNumbers);
        return res.status(200).json({
            walletAddress: walletAddress,
            count: tickets.length,
            lotteryNumbers, // just the arrays
            tickets, // full docs
        });
    }
    catch (error) {
        logger_1.default.error("Error in /tickets/mine", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getMyTickets = getMyTickets;
const getAllUsers = async (req, res) => {
    try {
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const userCollection = (0, userModel_1.getUserCollection)(db);
        const users = await userCollection.find({}).toArray();
        res
            .status(200)
            .json({ message: "All Users fetched Sucessfully", data: users });
    }
    catch (error) {
        logger_1.default.error("Error in getAllUsers API", { error });
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const referral = async (req, res) => {
    try {
        // Get wallet address from header
        const walletAddress = req.headers['wallet-address'];
        if (!walletAddress)
            return res.status(401).json({ error: "Wallet address required in header" });
        const { referralCode } = req.body;
        // Validate referral code format
        if (!(0, pointsHelper_1.isValidReferralCode)(referralCode)) {
            return res.status(400).json({ message: "Invalid referral code format" });
        }
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const userCollection = (0, userModel_1.getUserCollection)(db);
        const referralCollection = (0, userModel_1.getReferralCollection)(db);
        // Get current user from wallet address
        const currentUser = await userCollection.findOne({ walletAddress });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Find the referrer user by matching the last 12 digits of wallet address
        const referrerUser = await userCollection.findOne({
            walletAddress: { $regex: `${referralCode}$` }
        });
        if (!referrerUser) {
            return res.status(404).json({ message: "User with this referral code not found" });
        }
        // Check if current user is trying to refer themselves
        if (referrerUser.walletAddress === currentUser.walletAddress) {
            return res.status(400).json({ message: "Cannot refer yourself" });
        }
        // Check if this referral already exists
        const existingReferral = await referralCollection.findOne({
            userId: currentUser.uniqueID,
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
        const pointsCalculation = (0, pointsHelper_1.calculatePointsForReferral)(nextReferralCount);
        const referralData = {
            referralCode: referralCode, // The referrer's code
            points: pointsCalculation.points,
            userId: currentUser.uniqueID, // The user who is being referred
            referrerUserId: referrerUser.uniqueID, // The user who referred
            referrerWalletAddress: referrerUser.walletAddress,
            referrerUserName: referrerUser.userName,
            referrerTelegramId: referrerUser.telegramId,
            walletAddress: currentUser.walletAddress,
            userName: currentUser.userName,
            telegramId: currentUser.telegramId,
            createdAt: new Date(),
        };
        // Save referral data to database
        await referralCollection.insertOne(referralData);
        // Get updated points summary for the referrer
        const pointsSummary = (0, pointsHelper_1.getPointsSummary)(nextReferralCount);
        res.status(200).json({
            message: "Referral used successfully",
            success: true,
            referredUser: {
                userName: currentUser.userName,
                uniqueID: currentUser.uniqueID,
                walletAddress: currentUser.walletAddress
            },
            referrerUser: {
                userName: referrerUser.userName,
                uniqueID: referrerUser.uniqueID,
                walletAddress: referrerUser.walletAddress,
                referralCode: referralCode
            },
            pointsEarnedByReferrer: pointsCalculation.points,
            referrerTotalPoints: pointsCalculation.totalPoints
        });
    }
    catch (error) {
        console.error("Error in referral API:", error);
        logger_1.default.error("Error in referral API", { error });
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.referral = referral;
const getReferalData = async (req, res) => {
    try {
        // Get wallet address from header
        const walletAddress = req.headers['wallet-address'];
        if (!walletAddress)
            return res.status(401).json({ error: "Wallet address required in header" });
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const userCollection = (0, userModel_1.getUserCollection)(db);
        const referralCollection = (0, userModel_1.getReferralCollection)(db);
        // Get current user from wallet address
        const currentUser = await userCollection.findOne({ walletAddress });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Find referral record where current user was referred (userId matches current user)
        const referralRecord = await referralCollection.findOne({
            userId: currentUser.uniqueID
        });
        if (!referralRecord) {
            // Get user's referral code (last 12 digits of wallet address)
            const userReferralCode = walletAddress.slice(-12);
            return res.status(200).json({
                message: "No referral data found",
                data: {
                    currentUser: {
                        userName: currentUser.userName,
                        uniqueID: currentUser.uniqueID,
                        walletAddress: currentUser.walletAddress,
                        telegramId: currentUser.telegramId,
                        referralCode: userReferralCode,
                        points: 0
                    },
                    referredUsers: []
                }
            });
        }
        // Get current user data from referral record
        const currentUserData = {
            userName: referralRecord.userName,
            uniqueID: referralRecord.userId,
            walletAddress: referralRecord.walletAddress,
            telegramId: referralRecord.telegramId,
            referralCode: referralRecord.referralCode,
            points: referralRecord.points
        };
        // Get referrer data (who referred the current user)
        const referredUsers = [{
                referrerUserId: referralRecord.referrerUserId,
                referrerWalletAddress: referralRecord.referrerWalletAddress,
                referrerUserName: referralRecord.referrerUserName,
                referrerTelegramId: referralRecord.referrerTelegramId
            }];
        res.status(200).json({
            message: "Referral data fetched successfully",
            data: {
                currentUser: currentUserData,
                referredUsers: referredUsers
            }
        });
    }
    catch (error) {
        logger_1.default.error("Error in getReferalData API", { error });
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getReferalData = getReferalData;
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
exports.default = { login: exports.login, buyTicket: exports.buyTicket, getMyTickets: exports.getMyTickets, getPoolTickets: exports.getPoolTickets, getAllUsers, referral: exports.referral, getReferalData: exports.getReferalData };
