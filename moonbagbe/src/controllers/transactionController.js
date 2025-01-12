const SupabaseService = require("../services/supabaseService");

const getTransactionsByWallet = async (req, res) => {
  try {
    const transactions = await SupabaseService.getTransactionsByWallet(
      req.params.wallet_address
    );
    res.status(200).json(transactions);
  } catch (error) {
    console.log("hiii")
    res.status(500).json({ error: error.message });
  }
};

const getTransactionStats = async (req, res) => {
  try {
    const stats = await SupabaseService.getTransactionStats(
      req.params.wallet_address
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatPerToken = async (req, res) => {
  try {
    const stats = await SupabaseService.getTokenStats(
      req.params.wallet_address,
      req.params.token_address
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTransactionsByWallet,
  getTransactionStats,
  getStatPerToken,
};
