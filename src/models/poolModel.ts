export interface PoolDoc {
  _id?: any;
  poolId: string;
  contractAddress: string;
  adminAddress: string;
  adminPercentage: number;
  floorPercentage: number;
  bonusPercentage: number;
  decayFactorNumerator: number;
  decayFactorDenominator: number;
  bid: number;
  duration: number; // in hours
  maxTicket: number;
  startTime: Date;
  endTime: Date;
  // totalPool: number;
  // participantCount: number;
  // rewardsPrepared: boolean;
  // rewardsDistributed: boolean;
  status: 'ongoing' | 'upcoming' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

import { Db, Collection } from "mongodb";

export const getPoolCollection = (db: Db): Collection<PoolDoc> =>
  db.collection<PoolDoc>("pools");
