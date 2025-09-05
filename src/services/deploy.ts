import {
  internal,
  toNano,
  Address,
  StateInit
} from "@ton/core";
import { TonClient,WalletContractV5R1 } from "@ton/ton"; // <== Import wallet here
import { mnemonicToPrivateKey } from "@ton/crypto";
//import { getHttpEndpoint } from "@orbs-network/ton-access";
import { buildDeploymentTx } from "./buildDeploymentTx"; // 👈 Import helper
//import { Address } from "@ton/core"; // ✅ CORRECT
import { SendMode } from "@ton/ton";


export async function deployLotteryToTestnet(params: {
  adminPct: number;
  floorPct: number;
  bonusPct: number;
  decayNum: number;
  decayDenom: number;
  bid: string;
  howLong: number;
  maxTicket: number;}): Promise<{
    contractAddr: any;
    stateInit: StateInit;
  }> {
    const {
    adminPct,
    floorPct,
    bonusPct,
    decayNum,
    decayDenom,
    bid,
    howLong,
    maxTicket
  } = params;
  // const mnemonic: string[] = [
  //   "october", "verify", "rally", "cradle", "hungry",
  //   "lumber", "electric", "average", "orange","dolphin",
  //   "wave", "theme", "economy","super","rebuild","lawn"
  //   ,"fantasy","day","garment","crane","large","post","kitchen","agree" ];

    // const mnemonic: string[] = [
    //   "spawn", "private", "satoshi", "increase", "episode",
    //   "soup", "inquiry", "pencil", "lens","dumb",
    //   "ramp", "orange", "resemble","jaguar","shift","blame"
    //   ,"milk","raccoon","begin","mouse","merit","approve","paper","inject" ];

     const mnemonic: string[] = [
    "stem", "ice", "daughter", "portion", "artefact",
    "brother", "regret", "fantasy", "void","display",
    "head", "ensure", "success","milk","verify","antique"
    ,"parrot","scene","public","equal","twin","blanket","favorite","traffic" ];

  const keyPair = await mnemonicToPrivateKey(mnemonic);
//   const endpoint = await getHttpEndpoint({ network: "testnet" }); // ✅ Force testnet
//   const client = new TonClient({ endpoint });
const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC"; // 🔧 Replace this with a known good endpoint
const client = new TonClient({ endpoint,apiKey:"a2ac90f03c7c129df083afa916b29c19609e4a54cd0686dc75ff11631ebd41b3" }); // Add your API key if required
 //const client = await getClientWithRetry("https://testnet.toncenter.com/api/v2/jsonRPC");
   
 const walletId = {
        networkGlobalId: -3, // Use -3 for testnet, or -239 for mainnet
        context: {
            walletVersion: 'v5r1' as const,
            workchain: 0,
            subwalletNumber: 0
          }
};

  const wallet = WalletContractV5R1.create({
    
    publicKey: keyPair.publicKey,
    walletId
    
});
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
 
  const { contractAddr, stateInit } = await buildDeploymentTx({
    // adminPct: 10,
    // floorPct: 5,
    // bonusPct: 10,
    // decayNum: 17,
    // decayDenom: 20,
    // bid: "0.01",
    // howLong: 4,
    // maxTicket: 5
    adminPct,
    floorPct,
    bonusPct,
    decayNum,
    decayDenom,
    bid,
    howLong,
    maxTicket
  });
   
  console.log("📍 Deploying contract to address:", contractAddr.toString());
  console.log("🌐 Using testnet endpoint:", endpoint);
  const address = wallet.address.toString({ testOnly: true, bounceable: false });
  console.log("Wallet Address (testnet):", address);

   
  console.log("🧪 contractAddr:", contractAddr);
console.log("🧪 Type of contractAddr:", contractAddr);

   const contractState = await client.getContractState(contractAddr);
   console.log("🧪 contractState:", contractState);

    // 3. Check if the contract is active
    if (contractState.code) {
      console.log("🧪 contractState:", contractState);

      console.log("🧪 contractAddr:", contractAddr);
        console.log("✅ Contract is already deployed. No action needed.");
        return {
    contractAddr: contractAddr.toString(), // ✅ Convert to string for consistent response
    stateInit
  };
    }

await walletContract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [
        internal({
            to: contractAddr,
            value: toNano("0.05"),
            init: {
                code: stateInit.code,
                data: stateInit.data
            },
            body: null
        })
    ],
    sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE // Add the required sendMode
});
  console.log("✅ Deployment transaction sent.");
  return {
    contractAddr: contractAddr.toString(), // ✅ Convert to string for consistent response
    stateInit
  };
}

// deployLotteryToTestnet(requestAnimationFrame).catch(err => {
//   console.error("❌ Deployment failed:", err);
// });
// export { deployLotteryToTestnet };
// export default deployLotteryToTestnet; // Export for use in routes
