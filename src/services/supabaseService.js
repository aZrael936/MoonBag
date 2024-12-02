const { createClient } = require("@supabase/supabase-js");
const { config } = require("../config/env");

class SupabaseService {
  constructor() {
    this.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  }

  normalizeAddress(address) {
    return address ? address.toLowerCase() : null;
  }

  async addWallet({ address, inhouse_wallet_address, private_key, balance }) {
    const { data, error } = await this.supabase
      .from("wallets")
      .insert({
        address: this.normalizeAddress(address),
        inhouse_wallet_address: this.normalizeAddress(inhouse_wallet_address),
        private_key,
        balance,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateWalletInhouse(address, inhouseWallet) {
    const { data, error } = await this.supabase
      .from("wallets")
      .update({
        inhouse_wallet_address: this.normalizeAddress(inhouseWallet.address),
        private_key: inhouseWallet.privateKey, // Changed from encryptedPrivateKey
        balance: "0",
      })
      .eq("address", this.normalizeAddress(address))
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateWalletBalance(address, balance) {
    const { error } = await this.supabase
      .from("wallets")
      .update({ balance })
      .eq("inhouse_wallet_address", this.normalizeAddress(address));

    if (error) {
      throw error;
    }
  }

  async removeWallet(address) {
    const { error } = await this.supabase
      .from("wallets")
      .delete()
      .eq("address", this.normalizeAddress(address));

    if (error) {
      throw error;
    }
  }

  async listWallets() {
    const { data, error } = await this.supabase.from("wallets").select("*");

    if (error) {
      throw error;
    }

    // Normalize addresses in the returned data
    return data.map((wallet) => ({
      ...wallet,
      address: this.normalizeAddress(wallet.address),
      inhouse_wallet_address: this.normalizeAddress(
        wallet.inhouse_wallet_address
      ),
    }));
  }

  async getWalletByAddress(address) {
    const { data, error } = await this.supabase
      .from("wallets")
      .select("*")
      .eq("address", this.normalizeAddress(address))
      .single();

    if (error) {
      return null;
    }

    if (data) {
      // Normalize addresses in the returned data
      data.address = this.normalizeAddress(data.address);
      data.inhouse_wallet_address = this.normalizeAddress(
        data.inhouse_wallet_address
      );
    }

    return data;
  }
}

module.exports = new SupabaseService();
