export interface ReferralDoc {
  _id?: any;
  referralCode: string;
  points: number;
  userId: string;
  walletAddress: string;
  userName: string;
  telegramId: string;
  createdAt: Date;
}
