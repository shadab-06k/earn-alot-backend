// Using setInterval instead of node-cron for simplicity
import { getClient } from "../connections/connections";
import { getPoolCollection, PoolDoc } from "../models/poolModel";
import logger from "../common/logger";
import {
  TonClient,
  WalletContractV4,
  internal,
  fromNano,
  toNano,
  WalletContractV5R1,
} from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell } from "@ton/core";

interface Pool {
  poolId: string;
  contractAddress: string;
  adminAddress: string;
  endTime: Date;
  status: "ongoing" | "upcoming" | "completed";
}

class CronJobService {
  private tonClient: TonClient;
  private adminWallet: WalletContractV5R1 | null = null;

  constructor() {
    logger.info("CronJobService initialized");

    // Initialize TON client
    this.tonClient = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
      apiKey: "a2ac90f03c7c129df083afa916b29c19609e4a54cd0686dc75ff11631ebd41b3",
    });

    // Initialize admin wallet and wait for it
    this.initializeAdminWallet();
  }

  private async initializeAdminWallet() {
    try {
      const mnemonic: string[] = [
        "stem", "ice", "daughter", "portion", "artefact",
        "brother", "regret", "fantasy", "void", "display",
        "head", "ensure", "success", "milk", "verify", "antique",
        "parrot", "scene", "public", "equal", "twin", "blanket", "favorite", "traffic"
      ];

      logger.info("Initializing admin wallet...");
      const keyPair = await mnemonicToPrivateKey(mnemonic);
      
      const walletId = {
        networkGlobalId: -3, // Use -3 for testnet, or -239 for mainnet
        context: {
          walletVersion: 'v5r1' as const,
          workchain: 0,
          subwalletNumber: 0
        }
      };

      this.adminWallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        walletId
      });

      logger.info(
        `Admin wallet initialized successfully. Address: ${this.adminWallet.address.toString()}`
      );
      
      // Test the wallet by getting its state
      const walletContract = this.tonClient.open(this.adminWallet);
      const balance = await walletContract.getBalance();
      logger.info(`Admin wallet ready. Balance: ${fromNano(balance)} TON`);
      
    } catch (error) {
      logger.error("Error initializing admin wallet:", error);
      throw error;
    }
  }

  // Start the cron job that runs every 5 minutes
  public async startCronJob() {
    logger.info("Starting cron job service...");

    // Wait for wallet initialization
    await this.waitForWalletInitialization();

    // Run immediately first time
    await this.processEndedPools();

    // Run every 5 minutes (300000 ms)
    setInterval(
      async () => {
        await this.processEndedPools();
      },
      5 * 60 * 1000
    );

    logger.info("Cron job scheduled to run every 5 minutes");
  }

  // Wait for wallet initialization to complete
  private async waitForWalletInitialization(): Promise<void> {
    return new Promise((resolve) => {
      const checkWallet = () => {
        if (this.adminWallet) {
          resolve();
        } else {
          setTimeout(checkWallet, 1000); // Check every second
        }
      };
      checkWallet();
    });
  }

  private async processEndedPools() {
    try {
      const client = await getClient();
      const db = client.db(process.env.DB_NAME);
      const Pools = getPoolCollection(db);

      const allPools = await Pools.find({}).toArray();
      
      if (allPools.length === 0) {
        return;
      }

      const now = new Date();

      const endedPools = allPools.filter(pool => 
        new Date(pool.endTime) < now && pool.status !== "completed"
      );

      if (endedPools.length === 0) {
        return;
      }

      logger.info(`Processing ${endedPools.length} unprocessed pools`);

      for (const pool of endedPools) {
        await this.processPoolRewards(pool);
        await this.sleep(5000);
      }

    } catch (error) {
      logger.error("Error processing ended pools:", error);
    }
  }

  private async processPoolRewards(pool: Pool) {
    try {
      logger.info(`Processing pool: ${pool.poolId}`);

      if (!this.adminWallet) {
        throw new Error("Admin wallet not initialized");
      }

      await this.prepareRewards(pool.contractAddress);
      await this.sleep(10000);
      await this.distributeRewards(pool.contractAddress);
      await this.sleep(10000);
      await this.updatePoolStatus(pool.poolId, "completed");

      logger.info(`Pool ${pool.poolId} completed`);
    } catch (error) {
      logger.error(`Error processing pool ${pool.poolId}:`, error);
    }
  }

  private async prepareRewards(contractAddress: string) {
    try {
      const prepareRewardsMessage = beginCell()
        .storeUint(0xa1ed4eaa, 32)
        .endCell();

      const boc = prepareRewardsMessage.toBoc().toString('base64');
      logger.info(`Prepare BOC: ${boc}`);

      await this.sendMessage(contractAddress, prepareRewardsMessage, toNano("0.05"));
    } catch (error) {
      logger.error(`Prepare failed:`, error);
      throw error;
    }
  }

  private async distributeRewards(contractAddress: string) {
    try {
      const distributeRewardsMessage = beginCell()
        .storeUint(0xa1ed4eab, 32)
        .endCell();

      const boc = distributeRewardsMessage.toBoc().toString('base64');
      logger.info(`Distribute BOC: ${boc}`);

      await this.sendMessage(contractAddress, distributeRewardsMessage, toNano("0.05"));
    } catch (error) {
      logger.error(`Distribute failed:`, error);
      throw error;
    }
  }

  private async sendMessage(
    contractAddress: string,
    messageBody: any,
    value: bigint
  ) {
    try {
      if (!this.adminWallet) {
        throw new Error("Admin wallet not initialized");
      }

      // Open the wallet contract
      const walletContract = this.tonClient.open(this.adminWallet);
      const seqno = await walletContract.getSeqno();

      // Create the internal message
      const internalMessage = internal({
        to: contractAddress,
        value: value,
        body: messageBody,
        init: undefined,
        bounce: false,
      });

      const mnemonic: string[] = [
        "stem", "ice", "daughter", "portion", "artefact",
        "brother", "regret", "fantasy", "void", "display",
        "head", "ensure", "success", "milk", "verify", "antique",
        "parrot", "scene", "public", "equal", "twin", "blanket", "favorite", "traffic"
      ];

      const keyPair = await mnemonicToPrivateKey(mnemonic);

      await walletContract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internalMessage],
        sendMode: 1,
      });

    } catch (error) {
      logger.error(`Send message failed:`, error);
      throw error;
    }
  }

  private async updatePoolStatus(
    poolId: string,
    status: "ongoing" | "upcoming" | "completed"
  ) {
    try {
      const client = await getClient();
      const db = client.db(process.env.DB_NAME);
      const Pools = getPoolCollection(db);

      await Pools.updateOne(
        { poolId },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

      logger.info(`Updated pool ${poolId} status to ${status}`);
    } catch (error) {
      logger.error(`Error updating pool status for ${poolId}:`, error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Test function to manually trigger prepare rewards (for debugging)
  public async testPrepareRewards(contractAddress: string) {
    try {
      logger.info(
        `🧪 Testing Prepare_rewards for contract: ${contractAddress}`
      );

      if (!this.adminWallet) {
        logger.error("Admin wallet not initialized");
        return;
      }

      await this.prepareRewards(contractAddress);
      logger.info("Test Prepare_rewards completed");
    } catch (error) {
      logger.error("Test Prepare_rewards failed:", error);
      throw error;
    }
  }

  // Manual function to process unprocessed ended pools
  public async processLastEndedPool() {
    try {
      logger.info("Processing unprocessed ended pools...");

      // Wait for wallet initialization
      await this.waitForWalletInitialization();

      if (!this.adminWallet) {
        logger.error("Admin wallet not initialized");
        return;
      }

      // Use the same logic as the cron job
      await this.processEndedPools();

      logger.info("Unprocessed pools processed");

    } catch (error) {
      logger.error("Error processing ended pools:", error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Force process the last ended pool immediately
  public async forceProcessLastPool() {
    try {
      logger.info("Force processing pools...");
      await this.processLastEndedPool();
    } catch (error) {
      logger.error("Error in force processing:", error);
      throw error;
    }
  }

  // Check status of all pools
  public async checkPoolStatus() {
    try {
      const client = await getClient();
      const db = client.db(process.env.DB_NAME);
      const Pools = getPoolCollection(db);

      const allPools = await Pools.find({}).toArray();
      const now = new Date();

      const poolStatus = allPools.map(pool => ({
        poolId: pool.poolId,
        endTime: pool.endTime,
        status: pool.status,
        hasEnded: new Date(pool.endTime) < now,
        needsProcessing: new Date(pool.endTime) < now && pool.status !== "completed"
      }));

      logger.info("Pool Status Report:");
      poolStatus.forEach(pool => {
        logger.info(`${pool.poolId}: ${pool.status} (ended: ${pool.hasEnded}, needs processing: ${pool.needsProcessing})`);
      });

      return poolStatus;
    } catch (error) {
      logger.error("Error checking pool status:", error);
      throw error;
    }
  }

  // Process a specific pool by poolId
  public async processSpecificPool(poolId: string) {
    try {
      logger.info(`Processing specific pool: ${poolId}`);

      // Wait for wallet initialization
      await this.waitForWalletInitialization();

      if (!this.adminWallet) {
        logger.error("Admin wallet not initialized");
        return;
      }

      const client = await getClient();
      const db = client.db(process.env.DB_NAME);
      const Pools = getPoolCollection(db);

      // Find the specific pool by poolId
      const specificPool = await Pools.findOne({ poolId }) as Pool;

      if (!specificPool) {
        logger.error(`Pool with ID ${poolId} not found in database`);
        return;
      }

      await this.processPoolRewards(specificPool);

    } catch (error) {
      logger.error(`Error processing specific pool ${poolId}:`, error);
      throw error;
    }
  }
}

export default CronJobService;
