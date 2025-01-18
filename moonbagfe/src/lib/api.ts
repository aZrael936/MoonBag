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
    const address =
      config.method === "get"
        ? config.url.split("/").pop()
        : config.data?.address;

    try {
      // Use ethers to validate the address format
      if (address) {
        ethers.getAddress(address); // Will throw if invalid
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
  add: async (address: string) => {
    const response = await api.post<WalletData>("/api/wallets/add", {
      address: address,
    });
    return {
      data: response.data ?? null, // Ensure data is never undefined
    };
  },

  remove: async (address: string): Promise<void> => {
    const checksumAddress = ethers.getAddress(address);
    await api.delete("/api/wallets/remove", {
      data: { address: checksumAddress },
    });
  },

  update: async (
    address: string,
    moonbagPercentage: number
  ): Promise<WalletData> => {
    if (moonbagPercentage < 0 || moonbagPercentage > 100) {
      throw new Error("Moonbag percentage must be between 0 and 100");
    }
    const checksumAddress = ethers.getAddress(address);
    const { data } = await api.post<WalletData>("/api/wallets/update", {
      address: checksumAddress,
      moonbagPercentage,
    });
    return data;
  },

  get: async (address: string) => {
    try {
      const response = await api.get<WalletData>(`/api/wallets/get/${address}`);
      return {
        data: response.data ?? null, // Ensure data is never undefined
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { data: null }; // Return null for not found
      }
      throw error;
    }
  },

  list: async (): Promise<WalletData[]> => {
    const { data } = await api.get<WalletData[]>("/api/wallets/list");
    return data;
  },
};

// Transaction endpoints with proper typing
export const transactionsApi = {
  getForWallet: async (address: string): Promise<Transaction[]> => {
    // const checksumAddress = ethers.getAddress(address);
    const { data } = await api.get<Transaction[]>(
      `/api/transaction/${address}`
    );
    return data;
  },

  getStats: async (address: string): Promise<TokenStats[]> => {
    // const checksumAddress = ethers.getAddress(address);
    const { data } = await api.get<TokenStats[]>(
      `/api/transaction/stats/${address}`
    );
    return data;
  },

  getTokenStats: async (
    address: string,
    tokenAddress: string
  ): Promise<TokenStats> => {
    const checksumWallet = ethers.getAddress(address);
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
