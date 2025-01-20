import axios, { AxiosError } from "axios";
import { ethers } from "ethers"; // Assuming you're using ethers

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Add proper error handling
interface ApiError {
  message: string;
  code?: string;
}

// Create a custom error class
export class ApiRequestError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor with better validation
api.interceptors.request.use((config) => {
  if (config.url?.includes("/wallets/")) {
    const walletAddress =
      config.method === "get"
        ? config.url.split("/").pop()
        : config.data?.walletAddress;

    try {
      // Use ethers to validate the address format
      if (walletAddress) {
        ethers.getAddress(walletAddress); // Will throw if invalid
      }
    } catch {
      throw new Error("Invalid Ethereum address format");
    }
  }
  return config;
});

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message || "An unknown error occurred";
    const statusCode = error.response?.status || 500;
    throw new ApiRequestError(statusCode, message);
  }
);

// Wallet endpoints with better typing and error handling
export const walletsApi = {
  add: async (walletAddress: string): Promise<WalletData> => {
    try {
      //   const checksumAddress = ethers.getAddress(walletAddress);
      console.log("walletaddress:", walletAddress);
      const { data } = await api.post<WalletData>("/api/wallets/add", {
        walletAddress: walletAddress,
      });
      return data;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      throw new Error("Failed to add wallet");
    }
  },

  remove: async (walletAddress: string): Promise<void> => {
    const checksumAddress = ethers.getAddress(walletAddress);
    await api.delete("/api/wallets/remove", {
      data: { walletAddress: checksumAddress },
    });
  },

  update: async (
    walletAddress: string,
    moonbagPercentage: number
  ): Promise<WalletData> => {
    if (moonbagPercentage < 0 || moonbagPercentage > 100) {
      throw new Error("Moonbag percentage must be between 0 and 100");
    }
    const checksumAddress = ethers.getAddress(walletAddress);
    const { data } = await api.post<WalletData>("/api/wallets/update", {
      walletAddress: checksumAddress,
      moonbagPercentage,
    });
    return data;
  },

  get: async (walletAddress: string): Promise<WalletData> => {
    const checksumAddress = ethers.getAddress(walletAddress);
    const { data } = await api.get<WalletData>(
      `/api/wallets/get/${checksumAddress}`
    );
    return data;
  },

  list: async (): Promise<WalletData[]> => {
    const { data } = await api.get<WalletData[]>("/api/wallets/list");
    return data;
  },
};

// Transaction endpoints with proper typing
export const transactionsApi = {
  getForWallet: async (walletAddress: string): Promise<Transaction[]> => {
    const checksumAddress = ethers.getAddress(walletAddress);
    const { data } = await api.get<Transaction[]>(
      `/api/transaction/${checksumAddress}`
    );
    return data;
  },

  getStats: async (walletAddress: string): Promise<TokenStats[]> => {
    const checksumAddress = ethers.getAddress(walletAddress);
    const { data } = await api.get<TokenStats[]>(
      `/api/transaction/stats/${checksumAddress}`
    );
    return data;
  },

  getTokenStats: async (
    walletAddress: string,
    tokenAddress: string
  ): Promise<TokenStats> => {
    const checksumWallet = ethers.getAddress(walletAddress);
    const checksumToken = ethers.getAddress(tokenAddress);
    const { data } = await api.get<TokenStats>(
      `/api/transaction/stats/${checksumWallet}/${checksumToken}`
    );
    return data;
  },
};

// Enhanced types with more specific fields
export interface WalletData {
  address: string;
  moonbagPercentage: number;
  createdAt: string;
}

export interface Transaction {
  id: string; // Added id field
  type: "buy" | "sell";
  token: {
    address: string;
    symbol: string;
    decimals: number; // Added decimals
  };
  amount: string;
  value: number;
  timestamp: string;
  transactionHash?: string; // Added optional hash
}

export interface TokenStats {
  tokenAddress: string;
  symbol: string;
  totalVolume: string;
  averagePrice: string;
  profitLoss: string;
  numberOfTrades?: number; // Added optional field
  lastTradeTimestamp?: string; // Added optional field
}

export interface TransactionData {
  id: number;
  wallet_address: string;
  inhouse_wallet_address: string;
  original_tx_hash: string;
  buyback_tx_hash: string;
  token_address: string;
  sell_amount: number;
  buyback_amount: number;
  buyback_percentage: number;
  status: "completed" | "pending" | "failed";
  created_at: string;
  updated_at: string;
}
