// Types based on the OpenAPI schema
interface Wallet {
  id: number;
  address: string;
  inhouse_wallet_address: string;
  balance: string;
  moonbag_percent: number;
  created_at: string;
  last_updated: string;
}

interface Transaction {
  id: number;
  wallet_address: string;
  inhouse_wallet_address: string;
  original_tx_hash: string;
  buyback_tx_hash: string;
  token_address: string;
  sell_amount: string;
  buyback_amount: string;
  buyback_percentage: number;
  status: string;
  created_at: string;
}

interface AddWalletResponse {
  message: string;
  wallet: {
    address: string;
    inhouse_wallet_address: string;
    balance: string;
  };
}

// API Client
import axios, { AxiosInstance } from "axios";

class MoonbagAPI {
  private api: AxiosInstance;

  constructor(baseURL = "http://localhost:3000") {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Wallet Methods
  async addWallet(address: string): Promise<AddWalletResponse> {
    const { data } = await this.api.post<AddWalletResponse>(
      "/api/wallets/add",
      {
        address,
      }
    );
    return data;
  }

  async removeWallet(address: string): Promise<void> {
    await this.api.delete("/api/wallets/remove", {
      data: { address },
    });
  }

  async updateWallet(address: string, moonbag_percent: number): Promise<void> {
    await this.api.post("/api/wallets/update", {
      address,
      moonbag_percent,
    });
  }

  async getWalletDetails(walletAddress: string): Promise<Wallet> {
    const { data } = await this.api.get<Wallet>(
      `/api/wallets/get/${walletAddress}`
    );
    return data;
  }

  async getAllWallets(): Promise<Wallet[]> {
    const { data } = await this.api.get<Wallet[]>("/api/wallets/list");
    return data;
  }

  // Transaction Methods
  async getWalletTransactions(walletAddress: string): Promise<Transaction[]> {
    const { data } = await this.api.get<Transaction[]>(
      `/api/transaction/${walletAddress}`
    );
    return data;
  }

  async getWalletStats(walletAddress: string): Promise<unknown> {
    const { data } = await this.api.get(
      `/api/transaction/stats/${walletAddress}`
    );
    return data;
  }

  async getTokenStats(
    walletAddress: string,
    tokenAddress: string
  ): Promise<unknown> {
    const { data } = await this.api.get(
      `/api/transaction/stats/${walletAddress}/${tokenAddress}`
    );
    return data;
  }
}

export const moonbagAPI = new MoonbagAPI();
