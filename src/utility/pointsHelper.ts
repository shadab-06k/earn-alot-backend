// Points calculation helper for referral system
// Based on the points system: Every 10 invites = 100 points, multiplier increases by 0.2, max multiplier 3.0

export interface PointsCalculation {
  points: number;
  multiplier: number;
  totalPoints: number;
}

export interface ReferralTier {
  tier: number;
  referralsRequired: number;
  multiplier: number;
  pointsPerReferral: number;
  totalPointsAtTier: number;
}

/**
 * Calculate points for a specific referral count
 * @param referralCount - Number of referrals (1-based)
 * @returns Points calculation for this specific referral
 */
export const calculatePointsForReferral = (referralCount: number): PointsCalculation => {
  // Base points per 10 referrals = 100 points
  const basePoints = 100;
  
  // Multiplier increases by 0.2 for every 10 referrals, max 3.0
  const multiplier = Math.min(1.0 + (Math.floor((referralCount - 1) / 10) * 0.2), 3.0);
  
  // Calculate points for current referral
  const points = basePoints * multiplier;
  
  // Calculate total points earned so far (without recursion)
  let totalPoints = 0;
  for (let i = 1; i <= referralCount; i++) {
    const tierMultiplier = Math.min(1.0 + (Math.floor((i - 1) / 10) * 0.2), 3.0);
    totalPoints += basePoints * tierMultiplier;
  }
  
  return { points, multiplier, totalPoints };
};

/**
 * Calculate total points earned up to a specific referral count
 * @param referralCount - Total number of referrals
 * @returns Total points earned
 */
export const calculateTotalPointsEarned = (referralCount: number): number => {
  let totalPoints = 0;
  const basePoints = 100;
  
  for (let i = 1; i <= referralCount; i++) {
    const multiplier = Math.min(1.0 + (Math.floor((i - 1) / 10) * 0.2), 3.0);
    totalPoints += basePoints * multiplier;
  }
  
  return totalPoints;
};

/**
 * Get referral tier information
 * @param referralCount - Current number of referrals
 * @returns Current tier information
 */
export const getReferralTier = (referralCount: number): ReferralTier => {
  const tier = Math.floor((referralCount - 1) / 10) + 1;
  const referralsRequired = Math.min(tier * 10, 100); // Max 100 referrals
  const multiplier = Math.min(1.0 + ((tier - 1) * 0.2), 3.0);
  const pointsPerReferral = 100 * multiplier;
  const totalPointsAtTier = calculateTotalPointsEarned(referralCount);
  
  return {
    tier,
    referralsRequired,
    multiplier,
    pointsPerReferral,
    totalPointsAtTier
  };
};

/**
 * Get all referral tiers (1-10)
 * @returns Array of all referral tiers with their details
 */
export const getAllReferralTiers = (): ReferralTier[] => {
  const tiers: ReferralTier[] = [];
  
  for (let tier = 1; tier <= 10; tier++) {
    const referralsRequired = tier * 10;
    const multiplier = Math.min(1.0 + ((tier - 1) * 0.2), 3.0);
    const pointsPerReferral = 100 * multiplier;
    const totalPointsAtTier = calculateTotalPointsEarned(referralsRequired);
    
    tiers.push({
      tier,
      referralsRequired,
      multiplier,
      pointsPerReferral,
      totalPointsAtTier
    });
  }
  
  return tiers;
};

/**
 * Calculate points breakdown for a user's referrals
 * @param referralCount - Total number of referrals
 * @returns Detailed breakdown of points earned
 */
export const getPointsBreakdown = (referralCount: number) => {
  const breakdown = [];
  const basePoints = 100;
  
  for (let i = 1; i <= referralCount; i++) {
    const multiplier = Math.min(1.0 + (Math.floor((i - 1) / 10) * 0.2), 3.0);
    const points = basePoints * multiplier;
    
    // Calculate cumulative points up to this referral
    let cumulativePoints = 0;
    for (let j = 1; j <= i; j++) {
      const tierMultiplier = Math.min(1.0 + (Math.floor((j - 1) / 10) * 0.2), 3.0);
      cumulativePoints += basePoints * tierMultiplier;
    }
    
    breakdown.push({
      referralNumber: i,
      points: points,
      multiplier: multiplier,
      cumulativePoints: cumulativePoints
    });
  }
  
  return breakdown;
};

/**
 * Get next tier information for motivation
 * @param currentReferrals - Current number of referrals
 * @returns Next tier information or null if at max tier
 */
export const getNextTierInfo = (currentReferrals: number) => {
  const currentTier = getReferralTier(currentReferrals);
  
  if (currentTier.tier >= 10) {
    return null; // Already at max tier
  }
  
  const nextTier = currentTier.tier + 1;
  const referralsNeeded = (nextTier * 10) - currentReferrals;
  const nextTierMultiplier = Math.min(1.0 + ((nextTier - 1) * 0.2), 3.0);
  const nextTierPointsPerReferral = 100 * nextTierMultiplier;
  
  return {
    nextTier,
    referralsNeeded,
    nextTierMultiplier,
    nextTierPointsPerReferral,
    currentTier: currentTier.tier,
    currentMultiplier: currentTier.multiplier
  };
};

/**
 * Validate referral code format (last 12 digits of UUID)
 * @param referralCode - The referral code to validate
 * @returns True if valid format
 */
export const isValidReferralCode = (referralCode: string): boolean => {
  // Should be exactly 12 characters, alphanumeric
  return /^[a-f0-9]{12}$/i.test(referralCode);
};

/**
 * Extract referral code from uniqueID (last 12 digits)
 * @param uniqueID - The user's uniqueID
 * @returns Last 12 digits as referral code
 */
export const extractReferralCode = (uniqueID: string): string => {
  return uniqueID.slice(-12);
};

/**
 * Calculate bonus points for special achievements
 * @param referralCount - Number of referrals
 * @returns Bonus points earned
 */
export const calculateBonusPoints = (referralCount: number): number => {
  let bonusPoints = 0;
  
  // Bonus for reaching certain milestones
  if (referralCount >= 10) bonusPoints += 50;  // First 10 referrals bonus
  if (referralCount >= 25) bonusPoints += 100; // 25 referrals bonus
  if (referralCount >= 50) bonusPoints += 200; // 50 referrals bonus
  if (referralCount >= 100) bonusPoints += 500; // 100 referrals bonus
  
  return bonusPoints;
};

/**
 * Get comprehensive points summary for a user
 * @param referralCount - Total number of referrals
 * @returns Complete points summary
 */
export const getPointsSummary = (referralCount: number) => {
  const tier = getReferralTier(referralCount);
  const totalPoints = calculateTotalPointsEarned(referralCount);
  const bonusPoints = calculateBonusPoints(referralCount);
  const nextTier = getNextTierInfo(referralCount);
  
  return {
    currentReferrals: referralCount,
    currentTier: tier.tier,
    currentMultiplier: tier.multiplier,
    totalPointsEarned: totalPoints,
    bonusPoints: bonusPoints,
    totalPointsWithBonus: totalPoints + bonusPoints,
    nextTier: nextTier,
    breakdown: getPointsBreakdown(referralCount)
  };
};
