const { createClient } = require("@supabase/supabase-js");
const { config } = require("../config/env");

class SupabaseService {
  constructor() {
    this.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  }

  async addWallet({
    address,
    inhouse_wallet_address,
    encrypted_private_key,
    balance,
  }) {
    const { data, error } = await this.supabase
      .from("wallets")
      .insert({
        address,
        inhouse_wallet_address,
        encrypted_private_key,
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
        inhouse_wallet_address: inhouseWallet.address,
        encrypted_private_key: inhouseWallet.encryptedPrivateKey,
        balance: "0",
      })
      .eq("address", address)
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
      .eq("inhouse_wallet_address", address);

    if (error) {
      throw error;
    }
  }

  async removeWallet(address) {
    const { error } = await this.supabase
      .from("wallets")
      .delete()
      .eq("address", address);

    if (error) {
      throw error;
    }
  }

  async listWallets() {
    const { data, error } = await this.supabase.from("wallets").select("*");

    if (error) {
      throw error;
    }

    return data;
  }

  async getWalletByAddress(address) {
    const { data, error } = await this.supabase
      .from("wallets")
      .select("*")
      .eq("address", address)
      .single();

    if (error) {
      return null;
    }

    return data;
  }
}

module.exports = new SupabaseService();
