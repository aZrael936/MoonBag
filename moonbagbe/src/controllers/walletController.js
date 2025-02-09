const { ethers } = require("ethers");
const SupabaseService = require("../services/supabaseService");
const MoralisService = require("../services/moralisService");
const WebSocketService = require("../services/WebSocketService");
const walletManagementService = require("../services/walletManagement");
const TokenBuybackService = require("../services/tokenBuybackService");

const addWallet = async (req, res) => {
  try {
    const { address } = req.body;
    console.log("aaadresss:", address)

    // Validate address
    const checksumAddress = ethers.getAddress(address);

    // Check if wallet already exists
    const existingWallet = await SupabaseService.getWalletByAddress(
      checksumAddress
    );

    console.log("existingWallet:", existingWallet)

    if (existingWallet) {
      // If wallet exists but doesn't have an inhouse wallet, create one
      if (!existingWallet.inhouse_wallet_address) {
        const inhouseWallet =
          await walletManagementService.createInhouseWallet();
        await SupabaseService.updateWalletInhouse(
          checksumAddress,
          inhouseWallet
        );
        return res.status(200).json({
          message: "Inhouse wallet created for existing wallet",
          wallet: {
            ...existingWallet,
            inhouse_wallet_address: inhouseWallet.address,
          },
        });
      }
      return res.status(200).json({
        message: "Wallet already tracked",
        wallet: existingWallet,
      });
    }

    // Add to Moralis stream
    await MoralisService.addAddressToStream(checksumAddress);

    // Create inhouse wallet
    const inhouseWallet = await walletManagementService.createInhouseWallet();

    // Add to Supabase with inhouse wallet details
    const newWallet = await SupabaseService.addWallet({
      address: checksumAddress,
      inhouse_wallet_address: inhouseWallet.address,
      private_key: inhouseWallet.encryptedPrivateKey,
      balance: "0",
      moonbag_percent: 10,
    });

    res.status(201).json({
      message: "Wallet added successfully",
      wallet: newWallet,
    });
  } catch (error) {
    console.error("Error in addWallet:", error);
    res.status(500).json({ error: error.message });
  }
};

// Backup endpoint in case inhouse wallet creation fails during connection
const regenerateInhouseWallet = async (req, res) => {
  try {
    const { address } = req.body;
    const checksumAddress = ethers.getAddress(address);

    const wallet = await SupabaseService.getWalletByAddress(checksumAddress);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const inhouseWallet = await walletManagementService.createInhouseWallet(
      checksumAddress
    );
    await SupabaseService.updateWalletInhouse(checksumAddress, inhouseWallet);

    res.status(200).json({
      message: "Inhouse wallet regenerated successfully",
      inhouse_wallet_address: inhouseWallet.address,
    });
  } catch (error) {
    console.error("Error in regenerateInhouseWallet:", error);
    res.status(500).json({ error: error.message });
  }
};

const removeWallet = async (req, res) => {
  try {
    const { address } = req.body;
    const checksumAddress = ethers.getAddress(address);

    // Remove from Moralis stream
    await MoralisService.removeAddressFromStream(checksumAddress);

    // Remove from Supabase
    await SupabaseService.removeWallet(checksumAddress);

    res.status(200).json({ message: "Wallet removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listWallets = async (req, res) => {
  try {
    const wallets = await SupabaseService.listWallets();
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWallet = async (req, res) => {
  const address = req.params.wallet_address;

  try {
    const wallets = await SupabaseService.getWalletByAddress(address);
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const txData = req.body;

    // Log the received webhook data
    console.log("Received webhook data:", txData);

    // If this is a test webhook from Moralis
    // if (txData.hasOwnProperty("test") || txData.hasOwnProperty("abi")) {
    //   console.log("Received test webhook");
    //   return res
    //     .status(200)
    //     .json({ message: "Test webhook received successfully" });
    // }

    // Process the transaction for potential buyback
    await TokenBuybackService.handleTransaction(txData);

    // // Broadcast transaction to all WebSocket clients
    // WebSocketService.broadcast(data);

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 to acknowledge receipt
    return res.status(200).json({ message: "Webhook received with errors" });
  }
};

const updateMoonbagPercent = async (req, res) => {
  try {
    const { moonbag_percent, address } = req.body;

    await walletManagementService.updateMoonbagPercent(
      moonbag_percent,
      address
    );

    return res.status(200).json({ message: "Percent updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Update received with errors" });
  }
};

module.exports = {
  addWallet,
  removeWallet,
  listWallets,
  getWallet,
  handleWebhook,
  regenerateInhouseWallet,
  updateMoonbagPercent,
};
