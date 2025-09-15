"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePoolStatus = exports.getPoolById = exports.getAllPools = exports.createPool = void 0;
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
        const deploymentResult = await (0, deploy_1.deployLotteryToTestnet)(deploymentParams);
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
            startTime: new Date(startTime || Date.now()),
            endTime: new Date(endTime || Date.now() + Number(duration) * 60 * 60 * 1000),
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
            bonusPercentage: newPool.bonusPercentage
        });
        return res.status(201).json({
            message: "Pool created successfully with deployed smart contract",
            pool: { ...newPool, _id: result.insertedId },
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
        const pools = await Pools.find({ status: 'ongoing' })
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
                isFull: remainingTickets <= 0
            };
        }));
        return res.status(200).json({
            message: "Pools fetched successfully",
            pools: poolsWithTicketInfo,
            count: poolsWithTicketInfo.length
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
exports.default = {
    createPool: exports.createPool,
    getAllPools: exports.getAllPools,
    getPoolById: exports.getPoolById,
    updatePoolStatus: exports.updatePoolStatus
};
