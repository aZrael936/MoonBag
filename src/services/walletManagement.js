const { ethers } = require("ethers");
const { encrypt, decrypt } = require("../utils/encryption");
const SupabaseService = require("./supabaseService");
const { config } = require("../config/env");

class WalletManagementService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.RPC_URL);
  }

  async createInhouseWallet() {
    try {
      // Generate new random wallet
      const wallet = ethers.Wallet.createRandom();

      // Connect wallet to provider
      const connectedWallet = wallet.connect(this.provider);

      // Encrypt private key before storage
      // const encryptedPrivateKey = await encrypt(wallet.privateKey);

      return {
        address: wallet.address,
        encryptedPrivateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error("Error creating inhouse wallet:", error);
      throw error;
    }
  }

  async decryptWalletPrivateKey(encryptedPrivateKey) {
    if (!encryptedPrivateKey) {
      throw new Error("Missing private key");
    }

    const privateKey = await decrypt(encryptedPrivateKey);
    return new ethers.Wallet(privateKey, this.provider);
  }

  async saveWalletToDatabase(walletData) {
    const { data, error } = await SupabaseService.supabase
      .from("wallets")
      .insert(walletData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save wallet: ${error.message}`);
    }

    return data;
  }

  async getWalletForUser(userAddress) {
    const { data, error } = await SupabaseService.supabase
      .from("wallets")
      .select("*")
      .eq("address", userAddress)
      .single();

    if (error) {
      throw new Error(`Failed to get wallet: ${error.message}`);
    }

    return data;
  }

  async getConnectedWallet(userAddress) {
    const walletData = await this.getWalletForUser(userAddress);
    if (!walletData || !walletData.private_key) {
      throw new Error("No wallet found for user or missing private key");
    }

    const privateKey = await decrypt(walletData.private_key);
    return new ethers.Wallet(privateKey, this.provider);
  }

  async checkBalance(walletAddress) {
    try {
      const balance = await this.provider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error checking balance:", error);
      throw error;
    }
  }

  async updateWalletBalance(walletAddress) {
    const balance = await this.checkBalance(walletAddress);

    const { error } = await SupabaseService.supabase
      .from("wallets")
      .update({
        balance,
        last_updated: new Date().toISOString(),
      })
      .eq("inhouse_wallet_address", walletAddress);

    if (error) {
      throw new Error(`Failed to update wallet balance: ${error.message}`);
    }
  }
}

const service = new WalletManagementService();
module.exports = service;
