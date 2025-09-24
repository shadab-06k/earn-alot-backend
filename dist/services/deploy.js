"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployLotteryToTestnet = deployLotteryToTestnet;
const core_1 = require("@ton/core");
const ton_1 = require("@ton/ton"); // <== Import wallet here
const crypto_1 = require("@ton/crypto");
//import { getHttpEndpoint } from "@orbs-network/ton-access";
const buildDeploymentTx_1 = require("./buildDeploymentTx"); // 👈 Import helper
//import { Address } from "@ton/core"; // ✅ CORRECT
const ton_2 = require("@ton/ton");
async function deployLotteryToTestnet(params) {
    const { adminPct, floorPct, bonusPct, decayNum, decayDenom, bid, howLong, maxTicket, } = params;
    //  const mnemonic: string[] = [
    // "stem", "ice", "daughter", "portion", "artefact",
    // "brother", "regret", "fantasy", "void","display",
    // "head", "ensure", "success","milk","verify","antique"
    // ,"parrot","scene","public","equal","twin","blanket","favorite","traffic" ];
    // Get mnemonic from environment variable
    const mnemonicString = process.env.ADMIN_MNEMONIC;
    console.log("ADMIN_MNEMONIC from env===>>", mnemonicString);
    if (!mnemonicString) {
        throw new Error("ADMIN_MNEMONIC environment variable is not set");
    }
    let mnemonic;
    try {
        // Try to parse as JSON array first
        if (mnemonicString.startsWith("[") && mnemonicString.endsWith("]")) {
            console.log("Parsing mnemonic as JSON array...");
            mnemonic = JSON.parse(mnemonicString);
        }
        else {
            // Fallback to space-separated string
            console.log("Parsing mnemonic as space-separated string...");
            mnemonic = mnemonicString.split(" ");
        }
    }
    catch (parseError) {
        console.log("JSON parse failed, trying space-separated...");
        mnemonic = mnemonicString.split(" ");
    }
    console.log("mnemonic array===>>", mnemonic);
    console.log("mnemonic length===>>", mnemonic.length);
    if (mnemonic.length !== 24) {
        throw new Error(`Invalid mnemonic length. Expected 24 words, got ${mnemonic.length}. Please check your ADMIN_MNEMONIC format.`);
    }
    let keyPair;
    try {
        console.log("Generating key pair from mnemonic...");
        keyPair = await (0, crypto_1.mnemonicToPrivateKey)(mnemonic);
        console.log("✅ Key pair generated successfully");
        console.log("Public key length:", keyPair.publicKey.length);
    }
    catch (keyPairError) {
        console.error("❌ Error generating key pair:", keyPairError);
        throw new Error(`Failed to generate key pair: ${keyPairError.message}`);
    }
    // Try multiple TON endpoints for better reliability
    const endpoints = [
        "https://testnet.toncenter.com/api/v2/jsonRPC",
        "https://toncenter.com/api/v2/jsonRPC",
    ];
    let client;
    let lastError;
    for (const endpoint of endpoints) {
        try {
            console.log(`Trying TON endpoint: ${endpoint}`);
            client = new ton_1.TonClient({
                endpoint,
                apiKey: "a2ac90f03c7c129df083afa916b29c19609e4a54cd0686dc75ff11631ebd41b3",
            });
            // Test the connection
            await client.getMasterchainInfo();
            console.log(`✅ Successfully connected to ${endpoint}`);
            break;
        }
        catch (endpointError) {
            console.error(`❌ Failed to connect to ${endpoint}:`, endpointError.message);
            lastError = endpointError;
            continue;
        }
    }
    if (!client) {
        throw new Error(`Failed to connect to any TON endpoint. Last error: ${lastError?.message}`);
    }
    //const client = await getClientWithRetry("https://testnet.toncenter.com/api/v2/jsonRPC");
    console.log("client===>>", client);
    // Try different wallet versions to find the correct one
    let wallet;
    let walletAddress;
    // Try v5r1 first (most common)
    try {
        console.log("Trying wallet version: v5r1");
        const walletId = {
            networkGlobalId: -3, // Use -3 for testnet, or -239 for mainnet
            context: {
                walletVersion: "v5r1",
                workchain: 0,
                subwalletNumber: 0,
            },
        };
        const testWallet = ton_1.WalletContractV5R1.create({
            publicKey: keyPair.publicKey,
            walletId,
        });
        walletAddress = testWallet.address.toString();
        console.log(`Wallet address (v5r1):`, walletAddress);
        // Test if this wallet has balance
        const testWalletContract = client.open(testWallet);
        const testBalance = await testWalletContract.getBalance();
        const balanceInTON = Number(testBalance) / 1e9;
        console.log(`Balance for v5r1:`, balanceInTON, "TON");
        if (balanceInTON >= 0.1) {
            console.log(`✅ Found wallet with sufficient balance using v5r1`);
            wallet = testWallet;
        }
        else {
            throw new Error(`Insufficient balance: ${balanceInTON} TON`);
        }
    }
    catch (versionError) {
        console.log(`❌ Error with v5r1:`, versionError.message);
        throw new Error(`Failed to find wallet with sufficient balance. Please check your mnemonic and ensure you have at least 0.1 TON in your testnet wallet. Error: ${versionError.message}`);
    }
    console.log("✅ Using wallet:", walletAddress);
    const walletContract = client.open(wallet);
    let seqno;
    try {
        seqno = await walletContract.getSeqno();
        console.log("Wallet seqno:", seqno);
    }
    catch (seqnoError) {
        console.error("Error getting wallet seqno:", seqnoError);
        throw new Error(`Failed to get wallet sequence number: ${seqnoError.message}`);
    }
    let contractAddr, stateInit;
    try {
        console.log("Building deployment transaction...");
        console.log("Deployment params:", {
            adminPct,
            floorPct,
            bonusPct,
            decayNum,
            decayDenom,
            bid,
            howLong,
            maxTicket,
        });
        const deploymentTxResult = await (0, buildDeploymentTx_1.buildDeploymentTx)({
            adminPct,
            floorPct,
            bonusPct,
            decayNum,
            decayDenom,
            bid,
            howLong,
            maxTicket,
        });
        contractAddr = deploymentTxResult.contractAddr;
        stateInit = deploymentTxResult.stateInit;
        console.log("✅ Deployment transaction built successfully");
        console.log("Contract address:", contractAddr.toString());
    }
    catch (buildError) {
        console.error("❌ Error building deployment transaction:", buildError);
        throw new Error(`Failed to build deployment transaction: ${buildError.message}`);
    }
    console.log("📍 Deploying contract to address:", contractAddr.toString());
    const address = wallet.address.toString({
        testOnly: true,
        bounceable: false,
    });
    console.log("Wallet Address (testnet):", address);
    console.log("🧪 contractAddr:", contractAddr);
    console.log("🧪 Type of contractAddr:", contractAddr);
    let contractState;
    try {
        contractState = await client.getContractState(contractAddr);
        console.log("🧪 contractState:", contractState);
    }
    catch (contractStateError) {
        console.error("Error getting contract state:", contractStateError);
        // If we can't get contract state, assume it's not deployed and continue
        contractState = { code: null };
    }
    // 3. Check if the contract is active
    if (contractState.code) {
        console.log("🧪 contractState:", contractState);
        console.log("🧪 contractAddr:", contractAddr);
        console.log("✅ Contract is already deployed. No action needed.");
        return {
            contractAddr: contractAddr.toString(), // ✅ Convert to string for consistent response
            stateInit,
        };
    }
    try {
        await walletContract.sendTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            messages: [
                (0, core_1.internal)({
                    to: contractAddr,
                    value: (0, core_1.toNano)("0.1"),
                    init: {
                        code: stateInit.code,
                        data: stateInit.data,
                    },
                    body: null,
                }),
            ],
            sendMode: ton_2.SendMode.CARRY_ALL_REMAINING_BALANCE, // Add the required sendMode
        });
        console.log("✅ Deployment transaction sent.");
    }
    catch (transferError) {
        console.error("Error sending deployment transaction:", transferError);
        throw new Error(`Failed to send deployment transaction: ${transferError.message}`);
    }
    return {
        contractAddr: contractAddr.toString(), // ✅ Convert to string for consistent response
        stateInit,
    };
}
// deployLotteryToTestnet(requestAnimationFrame).catch(err => {
//   console.error("❌ Deployment failed:", err);
// });
// export { deployLotteryToTestnet };
// export default deployLotteryToTestnet; // Export for use in routes
