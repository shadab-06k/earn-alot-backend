"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWallet = connectWallet;
const sdk_1 = require("@tonconnect/sdk");
// Simple in-memory storage polyfill for Node.js
class MemoryStorage {
    constructor() {
        this.store = {};
    }
    async getItem(key) {
        return this.store[key] ?? null;
    }
    async setItem(key, value) {
        this.store[key] = value;
    }
    async removeItem(key) {
        delete this.store[key];
    }
}
const connector = new sdk_1.TonConnect({
    manifestUrl: "http://localhost:3000/tonconnect-manifest.json",
    storage: new MemoryStorage()
});
async function connectWallet(address) {
    // Just mock a response for now
    return { message: `Wallet ${address} connected!` };
}
