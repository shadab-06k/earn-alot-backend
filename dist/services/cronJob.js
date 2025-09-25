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
        this.adminKeyPair = null;
        logger_1.default.info("CronJobService initialized");
    }
    async initialize() {
        // Initialize TON client with retry mechanism
        await this.initializeTonClient();
        // Initialize admin wallet and wait for it
        await this.initializeAdminWallet();
    }
    async initializeTonClient() {
        const endpoints = [
            "https://testnet.toncenter.com/api/v2/jsonRPC",
            "https://toncenter.com/api/v2/jsonRPC"
        ];
        for (const endpoint of endpoints) {
            try {
                console.log(`Trying TON endpoint: ${endpoint}`);
                this.tonClient = new ton_1.TonClient({
                    endpoint: endpoint,
                    apiKey: "a2ac90f03c7c129df083afa916b29c19609e4a54cd0686dc75ff11631ebd41b3",
                });
                // Test the connection
                await this.tonClient.getMasterchainInfo();
                console.log(`TON client initialized successfully with endpoint: ${endpoint}`);
                return;
            }
            catch (error) {
                console.error(`Failed to connect to ${endpoint}:`, error);
                if (endpoint === endpoints[endpoints.length - 1]) {
                    throw new Error(`Failed to connect to any TON endpoint. Last error: ${error}`);
                }
            }
        }
    }
    async getMnemonicAndKeyPair() {
        // Get mnemonic from environment variable
        const mnemonicString = process.env.ADMIN_MNEMONIC;
        console.log('ADMIN_MNEMONIC from env===>>', mnemonicString);
        if (!mnemonicString) {
            throw new Error("ADMIN_MNEMONIC environment variable is not set");
        }
        let mnemonic;
        try {
            // Try to parse as JSON array first
            if (mnemonicString.startsWith('[') && mnemonicString.endsWith(']')) {
                console.log('Parsing mnemonic as JSON array...');
                mnemonic = JSON.parse(mnemonicString);
            }
            else {
                // Fallback to space-separated string
                console.log('Parsing mnemonic as space-separated string...');
                mnemonic = mnemonicString.split(" ");
            }
        }
        catch (parseError) {
            console.log('JSON parse failed, trying space-separated...');
            mnemonic = mnemonicString.split(" ");
        }
        console.log('mnemonic array===>>', mnemonic);
        console.log('mnemonic length===>>', mnemonic.length);
        if (mnemonic.length !== 24) {
            throw new Error(`Invalid mnemonic length. Expected 24 words, got ${mnemonic.length}. Please check your ADMIN_MNEMONIC format.`);
        }
        try {
            const keyPair = await (0, crypto_1.mnemonicToPrivateKey)(mnemonic);
            console.log('Key pair generated successfully===>>');
            return { mnemonic, keyPair };
        }
        catch (keyError) {
            console.error('Key pair generation error:', keyError);
            throw new Error(`Failed to generate key pair from mnemonic: ${keyError.message}`);
        }
    }
    async initializeAdminWallet() {
        try {
            logger_1.default.info("Initializing admin wallet...");
            // Get mnemonic and key pair using helper method
            const { mnemonic, keyPair } = await this.getMnemonicAndKeyPair();
            // Store key pair for later use
            this.adminKeyPair = keyPair;
            const walletId = {
                networkGlobalId: -3, // Use -3 for testnet, or -239 for mainnet
                context: {
                    walletVersion: 'v5r1',
                    workchain: 0,
                    subwalletNumber: 0
                }
            };
            try {
                this.adminWallet = ton_1.WalletContractV5R1.create({
                    publicKey: keyPair.publicKey,
                    walletId
                });
                console.log('Wallet contract created successfully===>>');
            }
            catch (walletError) {
                console.error('Wallet contract creation error:', walletError);
                throw new Error(`Failed to create wallet contract: ${walletError.message}`);
            }
            logger_1.default.info(`Admin wallet initialized successfully. Address: ${this.adminWallet.address.toString()}`);
            // Test the wallet by getting its state with retry mechanism
            const walletContract = this.tonClient.open(this.adminWallet);
            let balance;
            try {
                balance = await walletContract.getBalance();
                console.log('Wallet balance checked successfully===>>', (0, ton_1.fromNano)(balance));
            }
            catch (balanceError) {
                console.error('Wallet balance check error:', balanceError);
                throw new Error(`Failed to check wallet balance: ${balanceError.message}`);
            }
            // Check if wallet has sufficient balance (at least 0.1 TON)
            const balanceInTON = parseFloat((0, ton_1.fromNano)(balance));
            if (balanceInTON < 0.1) {
                throw new Error(`Insufficient wallet balance. Need at least 0.1 TON, have ${balanceInTON} TON`);
            }
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
        // Initialize the service first
        await this.initialize();
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
                if (this.adminWallet && this.adminKeyPair) {
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
            // Use dynamic gas estimation for prepare rewards operation
            const gasAmount = this.getGasEstimate('prepare');
            logger_1.default.info(`Using gas amount: ${(0, ton_1.fromNano)(gasAmount)} TON for prepare rewards`);
            await this.sendMessage(contractAddress, prepareRewardsMessage, gasAmount);
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
            // Use dynamic gas estimation for distribute rewards operation
            const gasAmount = this.getGasEstimate('distribute');
            logger_1.default.info(`Using gas amount: ${(0, ton_1.fromNano)(gasAmount)} TON for distribute rewards`);
            await this.sendMessage(contractAddress, distributeRewardsMessage, gasAmount);
        }
        catch (error) {
            logger_1.default.error(`Distribute failed:`, error);
            throw error;
        }
    }
    async sendMessage(contractAddress, messageBody, value) {
        const maxRetries = 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (!this.adminWallet) {
                    throw new Error("Admin wallet not initialized");
                }
                if (!this.adminKeyPair) {
                    throw new Error("Admin key pair not initialized");
                }
                // Open the wallet contract
                const walletContract = this.tonClient.open(this.adminWallet);
                const seqno = await walletContract.getSeqno();
                // Create the internal message with higher gas limit
                const internalMessage = (0, ton_1.internal)({
                    to: contractAddress,
                    value: value,
                    body: messageBody,
                    init: undefined,
                    bounce: false,
                });
                logger_1.default.info(`Sending message attempt ${attempt}/${maxRetries} to ${contractAddress} with value ${(0, ton_1.fromNano)(value)} TON`);
                await walletContract.sendTransfer({
                    seqno,
                    secretKey: this.adminKeyPair.secretKey,
                    messages: [internalMessage],
                    sendMode: 1,
                });
                logger_1.default.info(`Message sent successfully on attempt ${attempt}`);
                return; // Success, exit the retry loop
            }
            catch (error) {
                lastError = error;
                logger_1.default.error(`Send message attempt ${attempt}/${maxRetries} failed:`, error.message);
                // Check if it's a gas-related error
                if (error.message.includes('out of gas') || error.message.includes('-14')) {
                    logger_1.default.warn(`Gas error detected, increasing gas amount for retry ${attempt + 1}`);
                    // Increase gas amount for next attempt
                    value = BigInt(Math.floor(Number(value) * 1.5));
                }
                if (attempt < maxRetries) {
                    const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                    logger_1.default.info(`Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        // If all retries failed
        logger_1.default.error(`Send message failed after ${maxRetries} attempts:`, lastError);
        throw lastError;
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
    // Estimate gas requirements for different operations
    getGasEstimate(operation) {
        const gasEstimates = {
            prepare: (0, ton_1.toNano)("0.15"), // Higher gas for prepare rewards
            distribute: (0, ton_1.toNano)("0.2") // Even higher gas for distribute rewards
        };
        return gasEstimates[operation];
    }
    // Test function to manually trigger prepare rewards (for debugging)
    async testPrepareRewards(contractAddress) {
        try {
            logger_1.default.info(`🧪 Testing Prepare_rewards for contract: ${contractAddress}`);
            // Initialize if not already done
            if (!this.adminWallet || !this.adminKeyPair) {
                await this.initialize();
            }
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
            // Initialize if not already done
            if (!this.adminWallet || !this.adminKeyPair) {
                await this.initialize();
            }
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
            // Initialize if not already done
            if (!this.adminWallet || !this.adminKeyPair) {
                await this.initialize();
            }
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
