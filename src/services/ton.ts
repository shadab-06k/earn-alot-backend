import { TonConnect } from "@tonconnect/sdk";

// Simple in-memory storage polyfill for Node.js
class MemoryStorage {
  private store: Record<string, string> = {};

  async getItem(key: string): Promise<string | null> {
    return this.store[key] ?? null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.store[key] = value;
  }
  async removeItem(key: string): Promise<void> {
    delete this.store[key];
  }
}

const connector = new TonConnect({
  manifestUrl: "http://localhost:3000/tonconnect-manifest.json",
  storage: new MemoryStorage()
});

export async function connectWallet(address: string) {
  // Just mock a response for now
  return { message: `Wallet ${address} connected!` };
}
