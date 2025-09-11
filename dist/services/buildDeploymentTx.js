"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeploymentTx = buildDeploymentTx;
const core_1 = require("@ton/core");
const LotteryDraw_Lottery_1 = require("./LotteryDraw_Lottery"); // Using the original working contract
async function buildDeploymentTx(params) {
    const { adminPct, floorPct, bonusPct, decayNum, decayDenom, bid, howLong, maxTicket } = params;
    const init = await LotteryDraw_Lottery_1.LotteryDraw.init(BigInt(adminPct), BigInt(floorPct), BigInt(bonusPct), BigInt(decayNum), BigInt(decayDenom), (0, core_1.toNano)(bid), BigInt(howLong), BigInt(maxTicket));
    const stateInit = {
        code: init.code,
        data: init.data
    };
    const addr = (0, core_1.contractAddress)(0, stateInit); // already returns Address in latest @ton/core
    return {
        contractAddr: addr, // ✅ no toString(), no parse()
        stateInit
    };
}
