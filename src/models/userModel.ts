// // db/users.ts
// import { Db, Collection, IndexDescription } from "mongodb";

// export interface UserDoc {
//   _id?: any;
//   uniqueID: string;
//   telegramId?: string | number;
//   userName: string;
//   // email: string;            // unique
//   walletAddress: string; // unique
//   maxBetAmount?: number;
//   poolAmount?: number;
//   jackpot?: number;
//   duration?: string;
//   date?: number;
//   // purchased lottery numbers (store as strings to preserve leading zeros)
//   lotteryNumbers: string[];

//   // counters
//   lotteriesPurchased: number; // cumulative purchases
//   endsIn?: string; // current unique numbers owned (lotteryNumbers.length)

//   createdAt: Date;
//   updatedAt: Date;
// }

// export const getUserCollection = (db: Db): Collection<UserDoc> => {
//   const col = db.collection<UserDoc>("users");
//   const indexes: IndexDescription[] = [
//     // { key: { email: 1 }, unique: true, name: "uniq_email" },
//     {
//       key: { walletAddress: 1 },
//       // unique: true,
//       sparse: true,
//       name: "uniq_wallet",
//     },
//     { key: { uniqueID: 1 }, name: "uniq_uniqueID" },
//   ];
//   col.createIndexes(indexes).catch(console.error);
//   return col;
// };

// db/users.ts
// import { Db, Collection, IndexDescription } from "mongodb";

// export interface PurchaseRecord {
//   id: string;                 // uuid
//   lotteryNumbers: string[];   // keep as strings to preserve leading zeros
//   ticketsCount: number;       // how many tickets in this purchase
//   jackpot?: string | number | null;
//   duration?: string | null;   // "HH:MM:SS"
//   endsIn?: string | null;     // "HH:MM:SS"
//   poolAmount?: number;        // pool price at purchase
//   date?: Date;                // draw date (if provided)
//   createdAt: Date;            // server timestamp for the record
// }

// export interface UserDoc {
//   _id?: any;
//   uniqueID: string;

//   telegramId?: string;        // store as string (you coerce on input)
//   userName: string;
//   walletAddress: string;      // unique
//   maxBetAmount?: number;

//   // flat/latest numbers for quick access (optional mirror of the latest purchase)
//   lotteryNumbers: string[];

//   // counters (cumulative, updated on each purchase)
//   lotteriesPurchased: number; // number of purchase events
//   ticketsCount: number;       // total tickets ever purchased

//   // latest pool/duration hints (optional, overwritten on new purchases)
//   poolAmount?: number;
//   endsIn?: string | null;

//   // structured history of all purchases
//   purchases?: PurchaseRecord[];
//   lastPurchaseAt?: Date;

//   createdAt: Date;
//   updatedAt: Date;
// }

// export const getUserCollection = (db: Db): Collection<UserDoc> => {
//   const col = db.collection<UserDoc>("users");
//   const indexes: IndexDescription[] = [
//     { key: { walletAddress: 1 }, unique: true, sparse: true, name: "uniq_wallet" },
//     { key: { uniqueID: 1 }, unique: true, name: "uniq_uniqueID" },
//     // helpful (non-unique) index to query by Telegram
//     { key: { telegramId: 1 }, name: "idx_telegramId" },
//     // optional recency queries
//     { key: { lastPurchaseAt: -1 }, name: "idx_lastPurchaseAt_desc" },
//   ];
//   col.createIndexes(indexes).catch(console.error);
//   return col;
// };

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

// src/db/collections.ts
import { Db, Collection } from "mongodb";

export const getUserCollection = (db: Db): Collection<UserDoc> =>
  db.collection<UserDoc>("users");

export const getTicketCollection = (db: Db): Collection<TicketDoc> =>
  db.collection<TicketDoc>("tickets");
