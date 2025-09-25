import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../common/logger";
import Web3 from "web3";
import {
  getTicketCollection,
  getUserCollection,
  getReferralCollection,
  getBnbTicketCollection,
  TicketDoc,
  UserDoc,
  ReferralDoc,
  BnbTicketDoc,
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
  isValidReferralCode,
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

    return res.status(200).json({
      message: "Login successful",
      user: {
        userName: user.userName,
        uniqueID: user.uniqueID,
        walletAddress: user.walletAddress,
        telegramId: user.telegramId,
      },
    });
  } catch (error) {
    logger.error("Error in /login", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /buy-ticket  (Wallet address in header required)
// Body: everything EXCEPT the wallet address: { lotteryNumbers, maxBetAmount, jackpot, duration, endsIn, poolAmount, date }
export const buyTicket = async (req: Request, res: Response) => {
  try {
    // Get wallet address from header
    const walletAddress = req.headers["wallet-address"] as string;
    if (!walletAddress)
      return res
        .status(401)
        .json({ error: "Wallet address required in header" });

    // Get user from database using wallet address
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Users = getUserCollection(db);

    const user = await Users.findOne({ walletAddress });
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      contractAddress,
      transactionHash,
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

    const Tickets = getTicketCollection(db);

    const ticket: TicketDoc = {
      ticketId: randomUUID(),
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
    const Pools = getPoolCollection(db);
    const pool = await Pools.findOne({ poolId: poolId });

    if (!pool) {
      return res.status(404).json({ error: "Pool not found" });
    }

    // Count current tickets for this pool (sum of lotteriesPurchased)
    const ticketRecords = await Tickets.find({ poolId: poolId }).toArray();
    const ticketsInPool = ticketRecords.reduce(
      (sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0),
      0
    );
    const remainingTickets = pool.maxTicket - ticketsInPool;

    // Check if there are enough tickets remaining
    const ticketsToPurchase = Number(lotteriesPurchased) || 1;
    if (remainingTickets < ticketsToPurchase) {
      return res.status(400).json({
        error: `Not enough tickets available. Remaining: ${remainingTickets}, Requested: ${ticketsToPurchase}`,
        remainingTickets: remainingTickets,
        requestedTickets: ticketsToPurchase,
        isPoolFull: remainingTickets === 0,
      });
    }

    const ins = await Tickets.insertOne(ticket);

    // Recalculate after insertion
    const updatedTicketRecords = await Tickets.find({
      poolId: poolId,
    }).toArray();
    const updatedTicketsInPool = updatedTicketRecords.reduce(
      (sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0),
      0
    );
    const updatedRemainingTickets = pool.maxTicket - updatedTicketsInPool;

    return res.status(200).json({
      message: "Ticket purchased successfully",
      ticket: { ...ticket, _id: ins.insertedId },
      poolInfo: {
        poolId: poolId,
        ticketsPurchased: updatedTicketsInPool,
        remainingTickets: updatedRemainingTickets,
        maxTickets: pool.maxTicket,
        isPoolFull: updatedRemainingTickets === 0,
      },
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
    const ticketsPurchased = ticketRecords.reduce(
      (sum, ticket) => sum + (ticket.lotteriesPurchased || 0),
      0
    );
    const remainingTickets = pool.maxTicket - ticketsPurchased;

    return res.status(200).json({
      poolId: poolId,
      maxTickets: pool.maxTicket,
      ticketsPurchased: ticketsPurchased,
      remainingTickets: remainingTickets,
      poolStatus: pool.status,
      isFull: remainingTickets <= 0,
    });
  } catch (error) {
    logger.error("Error getting pool tickets", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /tickets/mine  (Wallet address in header required)
// Returns all tickets for walletAddress in the header + a convenience array of only the lottery numbers arrays.
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    // Get wallet address from header
    const walletAddress = req.headers["wallet-address"] as string;
    if (!walletAddress)
      return res
        .status(401)
        .json({ error: "Wallet address required in header" });

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Tickets = getTicketCollection(db);

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
    // Get wallet address from header
    const walletAddress = req.headers["wallet-address"] as string;
    if (!walletAddress)
      return res
        .status(401)
        .json({ error: "Wallet address required in header" });

    const { referralCode } = req.body;

    // Validate referral code format
    // if (!isValidReferralCode(referralCode)) {
    //   return res.status(400).json({ message: "Invalid referral code format" });
    // }

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const userCollection = getUserCollection(db);
    const referralCollection = getReferralCollection(db);

    // Get current user from wallet address
    const currentUser = await userCollection.findOne({ walletAddress });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the referrer user by matching the last 12 digits of wallet address
    const referrerUser = await userCollection.findOne({
      walletAddress: { $regex: `${referralCode}$` },
    });

    if (!referrerUser) {
      return res
        .status(404)
        .json({ message: "User with this referral code not found" });
    }

    // Check if current user is trying to refer themselves
    // if (referrerUser.walletAddress === currentUser.walletAddress) {
    //   return res.status(400).json({ message: "Cannot refer yourself" });
    // }

    // Check if this referral already exists
    const existingReferral = await referralCollection.findOne({
      userId: currentUser.uniqueID,
      referralCode: referralCode,
    });

    if (existingReferral) {
      return res
        .status(400)
        .json({ message: "You have already used this referral code" });
    }

    // Get referrer's current referral count to calculate points
    const referrerReferrals = await referralCollection
      .find({
        referrerUserId: referrerUser.uniqueID,
      })
      .toArray();

    const currentReferralCount = referrerReferrals.length;
    const nextReferralCount = currentReferralCount + 1;

    // Calculate points for this referral
    const pointsCalculation = calculatePointsForReferral(nextReferralCount);

    const referralData: ReferralDoc = {
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
    const pointsSummary = getPointsSummary(nextReferralCount);

    res.status(200).json({
      message: "Referral used successfully",
      success: true,
      referredUser: {
        userName: currentUser.userName,
        uniqueID: currentUser.uniqueID,
        walletAddress: currentUser.walletAddress,
      },
      referrerUser: {
        userName: referrerUser.userName,
        uniqueID: referrerUser.uniqueID,
        walletAddress: referrerUser.walletAddress,
        referralCode: referralCode,
      },
      pointsEarnedByReferrer: pointsCalculation.points,
      referrerTotalPoints: pointsCalculation.totalPoints,
    });
  } catch (error) {
    console.error("Error in referral API:", error);
    logger.error("Error in referral API", { error });
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getReferalData = async (req: Request, res: Response) => {
  try {
    // Get wallet address from header
    const walletAddress = req.headers["wallet-address"] as string;
    if (!walletAddress)
      return res
        .status(401)
        .json({ error: "Wallet address required in header" });

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const userCollection = getUserCollection(db);
    const referralCollection = getReferralCollection(db);

    // Get current user from wallet address
    const currentUser = await userCollection.findOne({ walletAddress });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find referral record where current user was referred (userId matches current user)
    const referralRecord = await referralCollection.findOne({
      userId: currentUser.uniqueID,
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
            points: 0,
          },
          referredUsers: [],
        },
      });
    }

    // Get current user data from referral record
    const currentUserData = {
      userName: referralRecord.userName,
      uniqueID: referralRecord.userId,
      walletAddress: referralRecord.walletAddress,
      telegramId: referralRecord.telegramId,
      referralCode: referralRecord.referralCode,
      points: referralRecord.points,
    };

    // Get referrer data (who referred the current user)
    const referredUsers = [
      {
        referrerUserId: referralRecord.referrerUserId,
        referrerWalletAddress: referralRecord.referrerWalletAddress,
        referrerUserName: referralRecord.referrerUserName,
        referrerTelegramId: referralRecord.referrerTelegramId,
      },
    ];

    res.status(200).json({
      message: "Referral data fetched successfully",
      data: {
        currentUser: currentUserData,
        referredUsers: referredUsers,
      },
    });
  } catch (error) {
    logger.error("Error in getReferalData API", { error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const claimBnbTicket = async (req: Request, res: Response) => {
  try {
    console.log('claimBnbTicket Started===>>')
    const walletAddress = req.headers["wallet-address"] as string;
    if (!walletAddress)
      return res
        .status(401)
        .json({ error: "Wallet address required in header" });
        console.log('walletAddress===>>',walletAddress)
    
    const {
      ticketId,
      bonusAmountInUSD,
      bonusAmountInTON,
      gldAmount,
      rewardInTON,
      rewardInUSD,
      currentTonPrice,
      bnbAddress,
      poolAmount,
    } = req.body;

    // Validate required fields
    const missing = [["ticketId", ticketId],
      ["bonusAmountInUSD", bonusAmountInUSD],
      ["bonusAmountInTON", bonusAmountInTON],
      ["gldAmount", gldAmount],
      ["rewardInTON", rewardInTON],
      ["rewardInUSD", rewardInUSD],
      ["currentTonPrice", currentTonPrice],
      ["bnbAddress", bnbAddress],
      ["poolAmount", poolAmount],
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

    // Get user from database
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Users = getUserCollection(db);
    console.log('Users=uyagddiqediuq==>>')
    const user = await Users.findOne({ walletAddress });
    console.log('user===>>',user)
    if (!user) return res.status(404).json({ error: "User not found" });

    // Web3 is already imported at the top
    console.log('Web3 after ===>>', Web3)
    
    if (typeof Web3 !== 'function') {
      console.error('Web3 is not a constructor:', typeof Web3, Web3);
      return res.status(500).json({ 
        error: "Web3 import failed", 
        details: "Web3 is not a constructor" 
      });
    }
    
    // Initialize Web3 with BSC Testnet RPC
    console.log('process.env.BSC_RPC_URL ===>>',process.env.BSC_RPC_URL)
    
    // Use fallback URL if environment variable is not set
    const rpcUrl = process.env.BSC_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/';
    console.log('Using RPC URL ===>>', rpcUrl)
    
    let web3;
    try {
      web3 = new Web3(rpcUrl);
      console.log('Web3 afterdata ===>>',web3)
    } catch (web3Error: any) {
      console.error('Web3 initialization error:', web3Error);
      return res.status(500).json({ 
        error: "Failed to initialize Web3", 
        details: web3Error.message 
      });
    }
    
    // Get private key from environment
    let privateKey = process.env.PRIVATE_KEY;
    console.log('process.env.BSC_RPC_URL===>>',process.env.BSC_RPC_URL)
    console.log('privateKey===>>',privateKey)
    if (!privateKey) {
      return res.status(500).json({ error: "Private key not configured" });
    }

    // Ensure private key has 0x prefix
    if (!privateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey;
      console.log('Added 0x prefix to private key===>>',privateKey)
    }

    // Create account from private key
    let account;
    try {
      account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      console.log('account===>>',account)
    } catch (accountError: any) {
      console.error('Account creation error:', accountError);
      return res.status(500).json({ 
        error: "Failed to create account from private key", 
        details: accountError.message 
      });
    }
    
    // Validate BNB address format
    if (!web3.utils.isAddress(bnbAddress)) {
      return res.status(400).json({ 
        error: "Invalid BNB address format",
        providedAddress: bnbAddress
      });
    }
    console.log('BNB address validation passed===>>', bnbAddress)

    // ERC20 Token Contract Address (BSC Testnet)
    const tokenAddress = '0x9bb9885C392A4d3c81B8128d72C5106f84b54B20';
    console.log('tokenAddress===>>',tokenAddress)
    
    // ERC20 ABI for transfer function
    const erc20ABI = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "type": "function"
      }
    ];

    // Create contract instance
    let tokenContract;
    try {
      tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
      console.log('tokenContract created successfully===>>')
    } catch (contractError: any) {
      console.error('Contract creation error:', contractError);
      return res.status(500).json({ 
        error: "Failed to create token contract", 
        details: contractError.message 
      });
    }

    // Convert GLD amount to Wei (18 decimals)
    const gldAmountWei = web3.utils.toWei(gldAmount.toString(), 'ether');
    console.log('gldAmountWei===>>',gldAmountWei)

    // Check token balance before transfer
    let balance: any, balanceInEther: string;
    try {
      balance = await tokenContract.methods.balanceOf(account.address).call();
      balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      console.log('balance===>>',balance)
      console.log('balanceInEther===>>',balanceInEther)
    } catch (balanceError: any) {
      console.error('Balance check error:', balanceError);
      return res.status(500).json({ 
        error: "Failed to check token balance", 
        details: balanceError.message 
      });
    }
    
    if (parseFloat(balanceInEther) < parseFloat(gldAmount.toString())) {
      return res.status(400).json({ 
        error: "Insufficient token balance",
        currentBalance: balanceInEther,
        requiredAmount: gldAmount.toString()
      });
    }

    // Prepare ERC20 transfer transaction
    let transferData;
    try {
      transferData = tokenContract.methods.transfer(bnbAddress, gldAmountWei).encodeABI();
      console.log('transferData encoded successfully===>>')
    } catch (encodeError: any) {
      console.error('Transfer data encoding error:', encodeError);
      return res.status(500).json({ 
        error: "Failed to encode transfer data", 
        details: encodeError.message 
      });
    }

    // Get gas price and estimate gas
    let gasPrice, gasEstimate;
    try {
      gasPrice = await web3.eth.getGasPrice();
      console.log('gasPrice===>>',gasPrice)
      
      gasEstimate = await tokenContract.methods.transfer(bnbAddress, gldAmountWei).estimateGas({ from: account.address });
      console.log('gasEstimate===>>',gasEstimate)
      console.log('account.address===>>',account.address)
    } catch (gasError: any) {
      console.error('Gas estimation error:', gasError);
      return res.status(500).json({ 
        error: "Failed to estimate gas", 
        details: gasError.message 
      });
    }

    const transaction = {
      from: account.address,
      to: tokenAddress,
      value: '0', // No BNB value for ERC20 transfer
      data: transferData,
      gas: gasEstimate,
      gasPrice: gasPrice,
    };
    
    console.log('transaction object===>>',transaction)

    // Send transaction
    let transactionHash: string;
    try {
      console.log('Sending transaction...===>>')
      const receipt = await web3.eth.sendTransaction(transaction);
      transactionHash = receipt.transactionHash as string;
      console.log('Transaction successful, hash===>>',transactionHash)
    } catch (transferError: any) {
      console.error('Transaction failed:', transferError);
      logger.error("ERC20 token transfer failed", { 
        error: transferError, 
        bnbAddress, 
        gldAmount,
        tokenAddress,
        fromAddress: account.address
      });
      return res.status(500).json({ 
        error: "Failed to transfer ERC20 token to BNB address",
        details: transferError.message 
      });
    }

    // Create BNB ticket document
    const BnbTickets = getBnbTicketCollection(db);
    const bnbTicket: BnbTicketDoc = {
      ticketId: ticketId,
      userId: user.uniqueID,
      walletAddress: user.walletAddress,
      userName: user.userName,
      telegramId: user.telegramId,
      bonusAmountInUSD: Number(bonusAmountInUSD) || 0,
      bonusAmountInTON: Number(bonusAmountInTON) || 0,
      gldAmount: Number(gldAmount) || 0,
      rewardInTON: Number(rewardInTON) || 0,
      rewardInUSD: Number(rewardInUSD) || 0,
      currentTonPrice: Number(currentTonPrice) || 0,
      bnbAddress: bnbAddress,
      tokenAddress: tokenAddress,
      poolAmount: Number(poolAmount) || 0,
      transactionHash: transactionHash,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const result = await BnbTickets.insertOne(bnbTicket);

    logger.info("ERC20 token transfer completed successfully", {
      ticketId: bnbTicket.ticketId,
      walletAddress,
      bnbAddress,
      gldAmount,
      tokenAddress,
      transactionHash,
    });

    res.status(200).json({
      success: true,
      message: "ERC20 token transferred successfully",
      data: {
        ticketId: bnbTicket.ticketId,
        transactionHash: transactionHash,
        gldAmount: gldAmount,
        bnbAddress: bnbAddress,
        tokenAddress: tokenAddress,
        status: 'completed'
      }
    });
    
  } catch (error) {
    logger.error("Error in claimBnbTicket API", { error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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

export default {
  login,
  buyTicket,
  getMyTickets,
  getPoolTickets,
  getAllUsers,
  referral,
  getReferalData,
  claimBnbTicket,
};
