export interface UserDoc {
  _id?: any;
  uniqueID: string;
  userName: string;
  walletAddress: string;
  telegramId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketDoc {
  _id?: any;
  ticketId: string;
  userId: string;             // UserDoc.uniqueID
  walletAddress: string;      // from JWT
  userName: string;           // from JWT
  telegramId: string;         // from JWT
  contractAddress: string;
  poolId: string;
  lotteryNumbers: (number | string)[];
  maxBetAmount: number;
  // jackpot: string | number;
  duration: string;
  endsIn: string;
  poolAmount: number;
  title: string;
  lotteriesPurchased:number,
  transactionHash:string,
  date: string;               // keep your format, or change to ISO string
  purchasedAt: Date;
  // optional: poolId?: string; idempotencyKey?: string;
}

export interface ReferralDoc {
  _id?: any;
  referralCode: string; // The referrer's code (last 12 digits of their uniqueID)
  points: number; // Points earned by the referrer
  userId: string; // The user who was referred
  referrerUserId: string; // The user who referred (earns points)
  referrerWalletAddress: string;
  referrerUserName: string;
  referrerTelegramId: string;
  walletAddress: string; // The referred user's wallet
  userName: string; // The referred user's name
  telegramId: string; // The referred user's telegram ID
  createdAt: Date;
}

export interface BnbTicketDoc {
  _id?: any;
  ticketId: string;
  userId: string; // UserDoc.uniqueID
  walletAddress: string; // from headers
  userName: string; // from JWT or user lookup
  telegramId: string; // from JWT or user lookup
  bonusAmountInUSD: number;
  bonusAmountInTON: number;
  gldAmount: number;
  rewardInTON: number;
  rewardInUSD: number;
  currentTonPrice: number;
  bnbAddress: string; // BNB address to send GLD to
  tokenAddress: string; // ERC20 token contract address
  poolAmount: number;
  transactionHash?: string; // BSC transaction hash
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// src/db/collections.ts
import { Db, Collection } from "mongodb";

export const getUserCollection = (db: Db): Collection<UserDoc> =>
  db.collection<UserDoc>("users");

export const getTicketCollection = (db: Db): Collection<TicketDoc> =>
  db.collection<TicketDoc>("tickets");

export const getReferralCollection = (db: Db): Collection<ReferralDoc> =>
  db.collection<ReferralDoc>("referrals");

export const getBnbTicketCollection = (db: Db): Collection<BnbTicketDoc> =>
  db.collection<BnbTicketDoc>("bnbTickets");
