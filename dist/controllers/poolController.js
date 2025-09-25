"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerPoolProcessing = exports.triggerCronJob = exports.updatePoolStatus = exports.getPoolById = exports.getAllPools = exports.createPool = void 0;
const logger_1 = __importDefault(require("../common/logger"));
const poolModel_1 = require("../models/poolModel");
const userModel_1 = require("../models/userModel");
const connections_1 = require("../connections/connections");
const crypto_1 = require("crypto");
const deploy_1 = require("../services/deploy");
// Create a new pool (called after smart contract deployment)
const createPool = async (req, res) => {
    try {
        const { adminAddress, adminPercentage, floorPercentage, bonusPercentage, decayFactorNumerator, decayFactorDenominator, bid, duration, maxTicket, startTime, endTime } = req.body;
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
        logger_1.default.info("Starting smart contract deployment for new pool", {
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
            deploymentResult = await (0, deploy_1.deployLotteryToTestnet)(deploymentParams);
        }
        catch (deploymentError) {
            logger_1.default.error("Contract deployment failed", {
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
            logger_1.default.error("Contract deployment failed", { deploymentResult });
            return res.status(500).json({
                error: "Failed to deploy smart contract",
                details: "Contract deployment returned invalid result"
            });
        }
        const contractAddress = deploymentResult.contractAddr;
        logger_1.default.info("Smart contract deployed successfully", { contractAddress });
        // Now save the pool data to database
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Pools = (0, poolModel_1.getPoolCollection)(db);
        // Calculate end time based on start time and duration (override frontend calculation)
        const durationHours = Number(duration);
        const calculatedEndTime = new Date(startTimeDate.getTime() + (durationHours * 60 * 60 * 1000));
        console.log('Start time:', startTimeDate.toISOString());
        console.log('Duration (hours):', durationHours);
        console.log('Frontend end time:', endTimeDate.toISOString());
        console.log('Calculated end time:', calculatedEndTime.toISOString());
        // Use the calculated end time instead of the frontend provided one
        const finalEndTime = calculatedEndTime;
        const newPool = {
            poolId: (0, crypto_1.randomUUID)(),
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
        logger_1.default.info("Pool created successfully", {
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
                startTimeIST: newPool.startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                endTimeIST: newPool.endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
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
    }
    catch (error) {
        logger_1.default.error("Error creating pool", { error });
        return res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.createPool = createPool;
// Get all active pools
const getAllPools = async (req, res) => {
    try {
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Pools = (0, poolModel_1.getPoolCollection)(db);
        const Tickets = (0, userModel_1.getTicketCollection)(db);
        const pools = await Pools.find({})
            .sort({ createdAt: -1 })
            .toArray();
        // Add ticket count information to each pool
        const poolsWithTicketInfo = await Promise.all(pools.map(async (pool) => {
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
        }));
        return res.status(200).json({
            message: "All pools fetched successfully",
            pools: poolsWithTicketInfo,
            count: poolsWithTicketInfo.length,
            ongoingCount: poolsWithTicketInfo.filter(pool => pool.status === 'ongoing').length,
            completedCount: poolsWithTicketInfo.filter(pool => pool.status === 'completed').length
        });
    }
    catch (error) {
        logger_1.default.error("Error fetching pools", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAllPools = getAllPools;
// Get pool by ID
const getPoolById = async (req, res) => {
    try {
        const { poolId } = req.params;
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Pools = (0, poolModel_1.getPoolCollection)(db);
        const Tickets = (0, userModel_1.getTicketCollection)(db);
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
    }
    catch (error) {
        logger_1.default.error("Error fetching pool", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getPoolById = getPoolById;
// Update pool status
const updatePoolStatus = async (req, res) => {
    try {
        const { poolId } = req.params;
        const { status, totalPool, participantCount, rewardsPrepared, rewardsDistributed } = req.body;
        const client = await (0, connections_1.getClient)();
        const db = client.db(process.env.DB_NAME);
        const Pools = (0, poolModel_1.getPoolCollection)(db);
        const updateData = { updatedAt: new Date() };
        if (status)
            updateData.status = status;
        if (totalPool !== undefined)
            updateData.totalPool = totalPool;
        if (participantCount !== undefined)
            updateData.participantCount = participantCount;
        if (rewardsPrepared !== undefined)
            updateData.rewardsPrepared = rewardsPrepared;
        if (rewardsDistributed !== undefined)
            updateData.rewardsDistributed = rewardsDistributed;
        const result = await Pools.updateOne({ poolId }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Pool not found" });
        }
        logger_1.default.info("Pool updated successfully", { poolId, updateData });
        return res.status(200).json({
            message: "Pool updated successfully",
            updated: result.modifiedCount > 0
        });
    }
    catch (error) {
        logger_1.default.error("Error updating pool", { error });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updatePoolStatus = updatePoolStatus;
// Manual trigger for cron job processing
const triggerCronJob = async (req, res) => {
    try {
        logger_1.default.info("Manual cron job trigger requested");
        // Import CronJobService here to avoid circular dependency
        const CronJobService = require('../services/cronJob').default;
        const cronJobService = new CronJobService();
        // Wait for wallet initialization
        await cronJobService.waitForWalletInitialization();
        // Process ended pools
        await cronJobService.processEndedPools();
        res.status(200).json({
            success: true,
            message: "Cron job triggered successfully"
        });
    }
    catch (error) {
        logger_1.default.error("Error triggering cron job:", error);
        res.status(500).json({
            error: "Failed to trigger cron job",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.triggerCronJob = triggerCronJob;
// Manual trigger for specific pool processing
const triggerPoolProcessing = async (req, res) => {
    try {
        const { poolId } = req.params;
        if (!poolId) {
            return res.status(400).json({
                error: "Pool ID is required"
            });
        }
        logger_1.default.info(`Manual pool processing trigger requested for pool: ${poolId}`);
        // Import CronJobService here to avoid circular dependency
        const CronJobService = require('../services/cronJob').default;
        const cronJobService = new CronJobService();
        // Process specific pool
        await cronJobService.processSpecificPool(poolId);
        res.status(200).json({
            success: true,
            message: `Pool ${poolId} processing triggered successfully`
        });
    }
    catch (error) {
        logger_1.default.error(`Error processing pool ${req.params.poolId}:`, error);
        res.status(500).json({
            error: "Failed to process pool",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.triggerPoolProcessing = triggerPoolProcessing;
exports.default = {
    createPool: exports.createPool,
    getAllPools: exports.getAllPools,
    getPoolById: exports.getPoolById,
    updatePoolStatus: exports.updatePoolStatus,
    triggerCronJob: exports.triggerCronJob,
    triggerPoolProcessing: exports.triggerPoolProcessing
};
