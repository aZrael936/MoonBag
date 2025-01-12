import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Wallet endpoints
export const walletsApi = {
  add: (walletAddress: string) =>
    api.post("/api/wallets/add", { walletAddress }),

  remove: (walletAddress: string) =>
    api.delete("/api/wallets/remove", { data: { walletAddress } }),

  update: (walletAddress: string, moonbagPercentage: number) =>
    api.post("/api/wallets/update", { walletAddress, moonbagPercentage }),

  get: (walletAddress: string) => api.get(`/api/wallets/get/${walletAddress}`),

  list: () => api.get("/api/wallets/list"),
};

// Transaction endpoints
export const transactionsApi = {
  getForWallet: (walletAddress: string) =>
    api.get(`/api/transaction/${walletAddress}`),

  getStats: (walletAddress: string) =>
    api.get(`/api/transaction/stats/${walletAddress}`),

  getTokenStats: (walletAddress: string, tokenAddress: string) =>
    api.get(`/api/transaction/stats/${walletAddress}/${tokenAddress}`),
};

// Types
export interface WalletData {
  address: string;
  moonbagPercentage: number;
  createdAt: string;
}

export interface Transaction {
  type: "buy" | "sell";
  token: {
    address: string;
    symbol: string;
  };
  amount: string;
  value: number;
  timestamp: string;
}

export interface TokenStats {
  tokenAddress: string;
  symbol: string;
  totalVolume: string;
  averagePrice: string;
  profitLoss: string;
}
