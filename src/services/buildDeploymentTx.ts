import {
  beginCell,
  toNano,
  StateInit,
  storeStateInit,
  contractAddress,
  Cell,
  Address
} from "@ton/core";
import { LotteryDraw } from "./LotteryDraw_Lottery"; // Using the original working contract

export async function buildDeploymentTx(params: {
  adminPct: number;
  floorPct: number;
  bonusPct: number;
  decayNum: number;
  decayDenom: number;
  bid: string;
  howLong: number;
  maxTicket: number;
}): Promise<{
  contractAddr: Address;
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

  const init = await LotteryDraw.init(
    BigInt(adminPct),
    BigInt(floorPct),
    BigInt(bonusPct),
    BigInt(decayNum),
    BigInt(decayDenom),
    toNano(bid),
    BigInt(howLong),
    BigInt(maxTicket)
  );

  const stateInit: StateInit = {
    code: init.code,
    data: init.data
  };

  const addr = contractAddress(0, stateInit); // already returns Address in latest @ton/core
  return {
    contractAddr: addr, // ✅ no toString(), no parse()
    stateInit
  };
}
