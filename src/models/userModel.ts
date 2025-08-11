// db/users.ts
import { Db, Collection, IndexDescription } from "mongodb";

export interface UserDoc {
  _id?: any;
  uniqueID: string;
  userName: string;
  email: string;            // unique
  walletAddress: string;    // unique
  telegramId?: string | number;
  maxBetAmount?: number;

  // purchased lottery numbers (store as strings to preserve leading zeros)
  lotteryNumbers: string[];

  // counters
  lotteriesPurchased: number;  // cumulative purchases
  ticketsCount: number;        // current unique numbers owned (lotteryNumbers.length)

  createdAt: Date;
  updatedAt: Date;
}

export const getUserCollection = (db: Db): Collection<UserDoc> => {
  const col = db.collection<UserDoc>("users");
  const indexes: IndexDescription[] = [
    { key: { email: 1 }, unique: true, name: "uniq_email" },
    { key: { walletAddress: 1 }, unique: true, sparse: true, name: "uniq_wallet" },
    { key: { uniqueID: 1 }, unique: true, name: "uniq_uniqueID" },
  ];
  col.createIndexes(indexes).catch(console.error);
  return col;
};
