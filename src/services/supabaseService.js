const { createClient } = require("@supabase/supabase-js");
const { config } = require("../config/env");

class SupabaseService {
  constructor() {
    this.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  }

  async addWallet(address) {
    const { data, error } = await this.supabase
      .from("wallets")
      .insert({ address })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
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
