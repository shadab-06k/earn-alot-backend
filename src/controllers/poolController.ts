import { Request, Response } from "express";
import logger from "../common/logger";
import { getPoolCollection, PoolDoc } from "../models/poolModel";
import { getTicketCollection } from "../models/userModel";
import { getClient } from "../connections/connections";
import { randomUUID } from "crypto";
import { deployLotteryToTestnet } from "../services/deploy";

// Create a new pool (called after smart contract deployment)
export const createPool = async (req: Request, res: Response) => {
  try {
    const {
      adminAddress,
      adminPercentage,
      floorPercentage,
      bonusPercentage,
      decayFactorNumerator,
      decayFactorDenominator,
      bid,
      duration,
      maxTicket,
      startTime,
      endTime
    } = req.body;

    // Enhanced validation
    if (!adminAddress || !bid || !duration || !maxTicket) {
      return res.status(400).json({
        error: "Missing required fields: adminAddress, bid, duration, maxTicket"
      });
    }

    // Validate numeric values
    if (isNaN(Number(bid)) || Number(bid) <= 0) {
      return res.status(400).json({
        error: "Invalid bid amount. Must be a positive number."
      });
    }

    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      return res.status(400).json({
        error: "Invalid duration. Must be a positive number."
      });
    }

    if (isNaN(Number(maxTicket)) || Number(maxTicket) <= 0) {
      return res.status(400).json({
        error: "Invalid maxTicket. Must be a positive number."
      });
    }

    // Validate start time and end time
    if (!startTime || !endTime) {
      return res.status(400).json({
        error: "Missing required fields: startTime, endTime"
      });
    }

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    
    // Debug logging
    console.log('=== TIME VALIDATION DEBUG ===');
    console.log('Raw startTime from frontend:', startTime);
    console.log('Raw endTime from frontend:', endTime);
    console.log('Parsed startTimeDate:', startTimeDate.toISOString());
    console.log('Parsed endTimeDate:', endTimeDate.toISOString());
    console.log('Time difference (ms):', endTimeDate.getTime() - startTimeDate.getTime());
    console.log('Time difference (hours):', (endTimeDate.getTime() - startTimeDate.getTime()) / (1000 * 60 * 60));
    console.log('================================');
    
    if (isNaN(startTimeDate.getTime())) {
      return res.status(400).json({
        error: "Invalid startTime format"
      });
    }
    
    if (isNaN(endTimeDate.getTime())) {
      return res.status(400).json({
        error: "Invalid endTime format"
      });
    }

    // Check if start time is in the past
    const now = new Date();
    if (startTimeDate < now) {
      return res.status(400).json({
        error: "Start time cannot be in the past"
      });
    }

    // Check if end time is after start time
    if (endTimeDate <= startTimeDate) {
      return res.status(400).json({
        error: "End time must be after start time",
        debug: {
          startTime: startTimeDate.toISOString(),
          endTime: endTimeDate.toISOString(),
          timeDifference: endTimeDate.getTime() - startTimeDate.getTime(),
          timeDifferenceHours: (endTimeDate.getTime() - startTimeDate.getTime()) / (1000 * 60 * 60)
        }
      });
    }

    // Validate percentages
    const adminPct = Number(adminPercentage) || 10;
    const floorPct = Number(floorPercentage) || 20;
    const bonusPct = Number(bonusPercentage) || 30;

    if (adminPct < 0 || adminPct > 100 || floorPct < 0 || floorPct > 100 || bonusPct < 0 || bonusPct > 100) {
      return res.status(400).json({
        error: "Percentages must be between 0 and 100"
      });
    }

    // First, deploy the smart contract
    logger.info("Starting smart contract deployment for new pool", { 
      adminAddress, 
      bid, 
      duration, 
      maxTicket,
      adminPct,
      floorPct,
      bonusPct
    });
    
    const deploymentParams = {
      adminPct,
      floorPct,
      bonusPct,
      decayNum: Number(decayFactorNumerator) || 8,
      decayDenom: Number(decayFactorDenominator) || 10,
      bid: String(bid),
      howLong: Number(duration),
      maxTicket: Number(maxTicket)
    };

    let deploymentResult;
    try {
      deploymentResult = await deployLotteryToTestnet(deploymentParams);
    } catch (deploymentError: any) {
      logger.error("Contract deployment failed", { 
        error: deploymentError.message,
        stack: deploymentError.stack 
      });
      return res.status(500).json({
        error: "Failed to deploy smart contract",
        details: deploymentError.message
      });
    }
    
    // Handle the response structure: { contractAddr: "...", stateInit: {...} }
    if (!deploymentResult || !deploymentResult.contractAddr) {
      logger.error("Contract deployment failed", { deploymentResult });
      return res.status(500).json({
        error: "Failed to deploy smart contract",
        details: "Contract deployment returned invalid result"
      });
    }

    const contractAddress = deploymentResult.contractAddr;
    logger.info("Smart contract deployed successfully", { contractAddress });

    // Now save the pool data to database
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Pools = getPoolCollection(db);

    // Calculate end time based on start time and duration (override frontend calculation)
    const durationHours = Number(duration);
    const calculatedEndTime = new Date(startTimeDate.getTime() + (durationHours * 60 * 60 * 1000));
    
    console.log('Start time:', startTimeDate.toISOString());
    console.log('Duration (hours):', durationHours);
    console.log('Frontend end time:', endTimeDate.toISOString());
    console.log('Calculated end time:', calculatedEndTime.toISOString());
    
    // Use the calculated end time instead of the frontend provided one
    const finalEndTime = calculatedEndTime;

    const newPool: PoolDoc = {
      poolId: randomUUID(),
      contractAddress,
      adminAddress,
      adminPercentage: adminPct,
      floorPercentage: floorPct,
      bonusPercentage: bonusPct,
      decayFactorNumerator: Number(decayFactorNumerator) || 8,
      decayFactorDenominator: Number(decayFactorDenominator) || 10,
      bid: Number(bid),
      duration: Number(duration),
      maxTicket: Number(maxTicket),
      startTime: startTimeDate,
      endTime: finalEndTime,
      // totalPool: 0,
      // participantCount: 0,
      // rewardsPrepared: false,
      // rewardsDistributed: false,
      status: 'ongoing',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Pools.insertOne(newPool);

    logger.info("Pool created successfully", { 
      poolId: newPool.poolId, 
      contractAddress,
      adminAddress,
      bid: newPool.bid,
      duration: newPool.duration,
      maxTicket: newPool.maxTicket,
      adminPercentage: newPool.adminPercentage,
      floorPercentage: newPool.floorPercentage,
      bonusPercentage: newPool.bonusPercentage,
      startTime: newPool.startTime.toISOString(),
      endTime: newPool.endTime.toISOString(),
      calculatedDuration: `${durationHours} hours`
    });

    return res.status(201).json({
      message: "Pool created successfully with deployed smart contract",
      pool: { 
        ...newPool, 
        _id: result.insertedId,
        // Add timezone info for debugging
        startTimeUTC: newPool.startTime.toISOString(),
        endTimeUTC: newPool.endTime.toISOString(),
        startTimeIST: newPool.startTime.toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
        endTimeIST: newPool.endTime.toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})
      },
      contractAddress,
      deploymentStatus: "success",
      deploymentDetails: {
        contractAddress,
        adminAddress,
        bid: newPool.bid,
        duration: newPool.duration,
        maxTicket: newPool.maxTicket
      }
    });
  } catch (error) {
    logger.error("Error creating pool", { error });
    return res.status(500).json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get all active pools
export const getAllPools = async (req: Request, res: Response) => {
  try {
    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Pools = getPoolCollection(db);
    const Tickets = getTicketCollection(db);

    const pools = await Pools.find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Add ticket count information to each pool
    const poolsWithTicketInfo = await Promise.all(
      pools.map(async (pool) => {
        const ticketRecords = await Tickets.find({ poolId: pool.poolId }).toArray();
        const ticketsPurchased = ticketRecords.reduce((sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0), 0);
        const remainingTickets = pool.maxTicket - ticketsPurchased;
        
        return {
          ...pool,
          ticketsPurchased,
          remainingTickets,
          isFull: remainingTickets <= 0,
          isOngoing: pool.status === 'ongoing',
          isCompleted: pool.status === 'completed'
        };
      })
    );

    return res.status(200).json({
      message: "All pools fetched successfully",
      pools: poolsWithTicketInfo,
      count: poolsWithTicketInfo.length,
      ongoingCount: poolsWithTicketInfo.filter(pool => pool.status === 'ongoing').length,
      completedCount: poolsWithTicketInfo.filter(pool => pool.status === 'completed').length
    });
  } catch (error) {
    logger.error("Error fetching pools", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get pool by ID
export const getPoolById = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Pools = getPoolCollection(db);
    const Tickets = getTicketCollection(db);

    const pool = await Pools.findOne({ poolId });

    if (!pool) {
      return res.status(404).json({ error: "Pool not found" });
    }

    // Add ticket count information
    const ticketRecords = await Tickets.find({ poolId: pool.poolId }).toArray();
    const ticketsPurchased = ticketRecords.reduce((sum, ticket) => sum + (Number(ticket.lotteriesPurchased) || 0), 0);
    const remainingTickets = pool.maxTicket - ticketsPurchased;

    const poolWithTicketInfo = {
      ...pool,
      ticketsPurchased,
      remainingTickets,
      isFull: remainingTickets <= 0
    };

    return res.status(200).json({
      message: "Pool fetched successfully",
      pool: poolWithTicketInfo
    });
  } catch (error) {
    logger.error("Error fetching pool", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update pool status
export const updatePoolStatus = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;
    const { status, totalPool, participantCount, rewardsPrepared, rewardsDistributed } = req.body;

    const client = await getClient();
    const db = client.db(process.env.DB_NAME);
    const Pools = getPoolCollection(db);

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (totalPool !== undefined) updateData.totalPool = totalPool;
    if (participantCount !== undefined) updateData.participantCount = participantCount;
    if (rewardsPrepared !== undefined) updateData.rewardsPrepared = rewardsPrepared;
    if (rewardsDistributed !== undefined) updateData.rewardsDistributed = rewardsDistributed;

    const result = await Pools.updateOne(
      { poolId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Pool not found" });
    }

    logger.info("Pool updated successfully", { poolId, updateData });

    return res.status(200).json({
      message: "Pool updated successfully",
      updated: result.modifiedCount > 0
    });
  } catch (error) {
    logger.error("Error updating pool", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createPool,
  getAllPools,
  getPoolById,
  updatePoolStatus
};
