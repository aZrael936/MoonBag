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

  async addTransaction({
    wallet_address,
    inhouse_wallet_address,
    original_tx_hash,
    buyback_tx_hash,
    token_address,
    sell_amount,
    buyback_amount,
    buyback_percentage,
    gas_used,
    gas_price,
    token_price_at_buyback,
  }) {
    const { data, error } = await this.supabase
      .from("transactions")
      .insert({
        wallet_address: this.normalizeAddress(wallet_address),
        inhouse_wallet_address: this.normalizeAddress(inhouse_wallet_address),
        original_tx_hash,
        buyback_tx_hash,
        token_address: this.normalizeAddress(token_address),
        sell_amount,
        buyback_amount,
        buyback_percentage,
        gas_used,
        gas_price,
        token_price_at_buyback,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getTransactionsByWallet(wallet_address) {
    const { data, error } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("wallet_address", this.normalizeAddress(wallet_address))
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getTransactionStats(wallet_address) {
    const { data, error } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("wallet_address", this.normalizeAddress(wallet_address));

    if (error) {
      throw error;
    }

    // Group transactions by token address
    const tokenStats = data.reduce((acc, tx) => {
      if (!acc[tx.token_address]) {
        acc[tx.token_address] = {
          token_address: tx.token_address,
          total_transactions: 0,
          total_sell_amount: 0n,
          total_buyback_amount: 0n,
          average_price: 0,
          total_gas_used: 0,
        };
      }

      acc[tx.token_address].total_transactions += 1;
      acc[tx.token_address].total_sell_amount += BigInt(tx.sell_amount);
      acc[tx.token_address].total_buyback_amount += BigInt(tx.buyback_amount);
      acc[tx.token_address].total_gas_used += Number(tx.gas_used || 0);

      // Calculate average price (considering it might be null)
      if (tx.token_price_at_buyback_per_weth) {
        const currentTotal =
          acc[tx.token_address].average_price *
          (acc[tx.token_address].total_transactions - 1);
        acc[tx.token_address].average_price =
          (currentTotal + Number(tx.token_price_at_buyback_per_weth)) /
          acc[tx.token_address].total_transactions;
      }

      return acc;
    }, {});

    return {
      overall_stats: {
        total_transactions: data.length,
        total_buyback_amount: data.reduce(
          (sum, tx) => sum + Number(tx.buyback_amount),
          0
        ),
        total_gas_used: data.reduce(
          (sum, tx) => sum + Number(tx.gas_used || 0),
          0
        ),
        total_gas_cost: data.reduce(
          (sum, tx) =>
            sum + Number(tx.gas_used || 0) * Number(tx.gas_price || 0),
          0
        ),
        average_buyback_percentage:
          data.length > 0
            ? data.reduce((sum, tx) => sum + tx.buyback_percentage, 0) /
              data.length
            : 0,
      },
      tokens_stats: Object.values(tokenStats).map((stat) => ({
        ...stat,
        total_sell_amount: stat.total_sell_amount.toString(),
        total_buyback_amount: stat.total_buyback_amount.toString(),
        average_price: stat.average_price,
      })),
    };
  }

  // Add this query to get stats for a specific token
  async getTokenStats(wallet_address, token_address) {
    const { data, error } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("wallet_address", this.normalizeAddress(wallet_address))
      .eq("token_address", this.normalizeAddress(token_address));

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return null;
    }

    return {
      token_address,
      total_transactions: data.length,
      total_sell_amount: data
        .reduce((sum, tx) => sum + BigInt(tx.sell_amount), 0n)
        .toString(),
      total_buyback_amount: data
        .reduce((sum, tx) => sum + BigInt(tx.buyback_amount), 0n)
        .toString(),
      total_gas_used: data.reduce(
        (sum, tx) => sum + Number(tx.gas_used || 0),
        0
      ),
      average_price:
        data.reduce(
          (sum, tx) => sum + Number(tx.token_price_at_buyback_per_weth || 0),
          0
        ) / data.length,
      transactions: data.map((tx) => ({
        date: tx.created_at,
        sell_amount: tx.sell_amount,
        buyback_amount: tx.buyback_amount,
        price: tx.token_price_at_buyback_per_weth,
        gas_used: tx.gas_used,
        gas_price: tx.gas_price,
      })),
    };
  }
}

module.exports = new SupabaseService();
