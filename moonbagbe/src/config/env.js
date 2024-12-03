const dotenv = require("dotenv");
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_KEY: process.env.SUPABASE_KEY || "",
  MORALIS_API_KEY: process.env.MORALIS_API_KEY || "",
  MORALIS_STREAM_ID: process.env.MORALIS_STREAM_ID || "",
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 4000,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  BASE_SEPOLIA_CHAIN_ID: 84532,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  RPC_URL: process.env.RPC_URL,
  ZERO_EX_API_KEY: process.env.ZERO_EX_API_KEY,
  CHAIN_ID: 8453,
  WETH_ADDRESS: "0x4200000000000000000000000000000000000006",
};

module.exports = { config };
