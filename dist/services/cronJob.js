"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Using setInterval instead of node-cron for simplicity
const connections_1 = require("../connections/connections");
const poolModel_1 = require("../models/poolModel");
const logger_1 = __importDefault(require("../common/logger"));
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
const core_1 = require("@ton/core");
class CronJobService {
    constructor() {
        this.adminWallet = null;
        logger_1.default.info("CronJobService initialized");
        // Initialize TON client
        this.tonClient = new ton_1.TonClient({
            endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
            apiKey: "a2ac90f03c7c129df083afa916b29c19609e4a54cd0686dc75ff11631ebd41b3",
        });
        // Initialize admin wallet and wait for it
        this.initializeAdminWallet();
    }
    async initializeAdminWallet() {
        try {
            const mnemonic = [
                "stem", "ice", "daughter", "portion", "artefact",
                "brother", "regret", "fantasy", "void", "display",
                "head", "ensure", "success", "milk", "verify", "antique",
                "parrot", "scene", "public", "equal", "twin", "blanket", "favorite", "traffic"
            ];
            logger_1.default.info("Initializing admin wallet...");
            const keyPair = await (0, crypto_1.mnemonicToPrivateKey)(mnemonic);
            const walletId = {
                networkGlobalId: -3, // Use -3 for testnet, or -239 for mainnet
                context: {
                    walletVersion: 'v5r1',
                    workchain: 0,
                    subwalletNumber: 0
                }
            };
            this.adminWallet = ton_1.WalletContractV5R1.create({
                publicKey: keyPair.publicKey,
                walletId
            });
            logger_1.default.info(`Admin wallet initialized successfully. Address: ${this.adminWallet.address.toString()}`);
            // Test the wallet by getting its state
            const walletContract = this.tonClient.open(this.adminWallet);
            const balance = await walletContract.getBalance();
            logger_1.default.info(`Admin wallet ready. Balance: ${(0, ton_1.fromNano)(balance)} TON`);
        }
        catch (error) {
            logger_1.default.error("Error initializing admin wallet:", error);
            throw error;
        }
    }
    // Start the cron job that runs every 5 minutes
    async startCronJob() {
        logger_1.default.info("Starting cron job service...");
        // Wait for wallet initialization
        await this.waitForWalletInitialization();
        // Run immediately first time
        await this.processEndedPools();
        // Run every 5 minutes (300000 ms)
        setInterval(async () => {
            await this.processEndedPools();
        }, 5 * 60 * 1000);
        logger_1.default.info("Cron job scheduled to run every 5 minutes");
    }
    // Wait for wallet initialization to complete
    async waitForWalletInitialization() {
        return new Promise((resolve) => {
            const checkWallet = () => {
                if (this.adminWallet) {
                    resolve();
                }
                else {
                    setTimeout(checkWallet, 1000); // Check every second
                }
            };
            checkWallet();
        });
    }
    async processEndedPools() {
        try {
            const client = await (0, connections_1.getClient)();
            const db = client.db(process.env.DB_NAME);
            const Pools = (0, poolModel_1.getPoolCollection)(db);
            const allPools = await Pools.find({}).toArray();
            if (allPools.length === 0) {
                return;
            }
            const now = new Date();
            const endedPools = allPools.filter(pool => new Date(pool.endTime) < now && pool.status !== "completed");
            if (endedPools.length === 0) {
                return;
            }
            logger_1.default.info(`Processing ${endedPools.length} unprocessed pools`);
            for (const pool of endedPools) {
                await this.processPoolRewards(pool);
                await this.sleep(5000);
            }
        }
        catch (error) {
            logger_1.default.error("Error processing ended pools:", error);
        }
    }
    async processPoolRewards(pool) {
        try {
            logger_1.default.info(`Processing pool: ${pool.poolId}`);
            if (!this.adminWallet) {
                throw new Error("Admin wallet not initialized");
            }
            await this.prepareRewards(pool.contractAddress);
            await this.sleep(10000);
            await this.distributeRewards(pool.contractAddress);
            await this.sleep(10000);
            await this.updatePoolStatus(pool.poolId, "completed");
            logger_1.default.info(`Pool ${pool.poolId} completed`);
        }
        catch (error) {
            logger_1.default.error(`Error processing pool ${pool.poolId}:`, error);
        }
    }
    async prepareRewards(contractAddress) {
        try {
            const prepareRewardsMessage = (0, core_1.beginCell)()
                .storeUint(0xa1ed4eaa, 32)
                .endCell();
            const boc = prepareRewardsMessage.toBoc().toString('base64');
            logger_1.default.info(`Prepare BOC: ${boc}`);
            await this.sendMessage(contractAddress, prepareRewardsMessage, (0, ton_1.toNano)("0.05"));
        }
        catch (error) {
            logger_1.default.error(`Prepare failed:`, error);
            throw error;
        }
    }
    async distributeRewards(contractAddress) {
        try {
            const distributeRewardsMessage = (0, core_1.beginCell)()
                .storeUint(0xa1ed4eab, 32)
                .endCell();
            const boc = distributeRewardsMessage.toBoc().toString('base64');
            logger_1.default.info(`Distribute BOC: ${boc}`);
            await this.sendMessage(contractAddress, distributeRewardsMessage, (0, ton_1.toNano)("0.05"));
        }
        catch (error) {
            logger_1.default.error(`Distribute failed:`, error);
            throw error;
        }
    }
    async sendMessage(contractAddress, messageBody, value) {
        try {
            if (!this.adminWallet) {
                throw new Error("Admin wallet not initialized");
            }
            // Open the wallet contract
            const walletContract = this.tonClient.open(this.adminWallet);
            const seqno = await walletContract.getSeqno();
            // Create the internal message
            const internalMessage = (0, ton_1.internal)({
                to: contractAddress,
                value: value,
                body: messageBody,
                init: undefined,
                bounce: false,
            });
            const mnemonic = [
                "stem", "ice", "daughter", "portion", "artefact",
                "brother", "regret", "fantasy", "void", "display",
                "head", "ensure", "success", "milk", "verify", "antique",
                "parrot", "scene", "public", "equal", "twin", "blanket", "favorite", "traffic"
            ];
            const keyPair = await (0, crypto_1.mnemonicToPrivateKey)(mnemonic);
            await walletContract.sendTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [internalMessage],
                sendMode: 1,
            });
        }
        catch (error) {
            logger_1.default.error(`Send message failed:`, error);
            throw error;
        }
    }
    async updatePoolStatus(poolId, status) {
        try {
            const client = await (0, connections_1.getClient)();
            const db = client.db(process.env.DB_NAME);
            const Pools = (0, poolModel_1.getPoolCollection)(db);
            await Pools.updateOne({ poolId }, {
                $set: {
                    status,
                    updatedAt: new Date(),
                },
            });
            logger_1.default.info(`Updated pool ${poolId} status to ${status}`);
        }
        catch (error) {
            logger_1.default.error(`Error updating pool status for ${poolId}:`, error);
            throw error;
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // Test function to manually trigger prepare rewards (for debugging)
    async testPrepareRewards(contractAddress) {
        try {
            logger_1.default.info(`🧪 Testing Prepare_rewards for contract: ${contractAddress}`);
            if (!this.adminWallet) {
                logger_1.default.error("Admin wallet not initialized");
                return;
            }
            await this.prepareRewards(contractAddress);
            logger_1.default.info("Test Prepare_rewards completed");
        }
        catch (error) {
            logger_1.default.error("Test Prepare_rewards failed:", error);
            throw error;
        }
    }
    // Manual function to process unprocessed ended pools
    async processLastEndedPool() {
        try {
            logger_1.default.info("Processing unprocessed ended pools...");
            // Wait for wallet initialization
            await this.waitForWalletInitialization();
            if (!this.adminWallet) {
                logger_1.default.error("Admin wallet not initialized");
                return;
            }
            // Use the same logic as the cron job
            await this.processEndedPools();
            logger_1.default.info("Unprocessed pools processed");
        }
        catch (error) {
            logger_1.default.error("Error processing ended pools:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    // Force process the last ended pool immediately
    async forceProcessLastPool() {
        try {
            logger_1.default.info("Force processing pools...");
            await this.processLastEndedPool();
        }
        catch (error) {
            logger_1.default.error("Error in force processing:", error);
            throw error;
        }
    }
    // Check status of all pools
    async checkPoolStatus() {
        try {
            const client = await (0, connections_1.getClient)();
            const db = client.db(process.env.DB_NAME);
            const Pools = (0, poolModel_1.getPoolCollection)(db);
            const allPools = await Pools.find({}).toArray();
            const now = new Date();
            const poolStatus = allPools.map(pool => ({
                poolId: pool.poolId,
                endTime: pool.endTime,
                status: pool.status,
                hasEnded: new Date(pool.endTime) < now,
                needsProcessing: new Date(pool.endTime) < now && pool.status !== "completed"
            }));
            logger_1.default.info("Pool Status Report:");
            poolStatus.forEach(pool => {
                logger_1.default.info(`${pool.poolId}: ${pool.status} (ended: ${pool.hasEnded}, needs processing: ${pool.needsProcessing})`);
            });
            return poolStatus;
        }
        catch (error) {
            logger_1.default.error("Error checking pool status:", error);
            throw error;
        }
    }
    // Process a specific pool by poolId
    async processSpecificPool(poolId) {
        try {
            logger_1.default.info(`Processing specific pool: ${poolId}`);
            // Wait for wallet initialization
            await this.waitForWalletInitialization();
            if (!this.adminWallet) {
                logger_1.default.error("Admin wallet not initialized");
                return;
            }
            const client = await (0, connections_1.getClient)();
            const db = client.db(process.env.DB_NAME);
            const Pools = (0, poolModel_1.getPoolCollection)(db);
            // Find the specific pool by poolId
            const specificPool = await Pools.findOne({ poolId });
            if (!specificPool) {
                logger_1.default.error(`Pool with ID ${poolId} not found in database`);
                return;
            }
            await this.processPoolRewards(specificPool);
        }
        catch (error) {
            logger_1.default.error(`Error processing specific pool ${poolId}:`, error);
            throw error;
        }
    }
}
exports.default = CronJobService;
