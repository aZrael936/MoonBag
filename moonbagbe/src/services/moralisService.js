const Moralis = require("moralis").default;
const { config } = require("../config/env");

class MoralisService {
  constructor() {
    this.streamId = config.MORALIS_STREAM_ID; // Add this to your config
    this.init();
  }

  async init() {
    try {
      await Moralis.start({
        apiKey: config.MORALIS_API_KEY,
      });
    } catch (error) {
      console.error("Error initializing Moralis:", error);
      throw error;
    }
  }

  async addAddressToStream(address) {
    try {
      if (!this.streamId) {
        throw new Error("Stream ID not configured");
      }

      const response = await Moralis.Streams.addAddress({
        networkType: "evm",
        id: this.streamId,
        address: [address],
      });

      return response;
    } catch (error) {
      console.error("Error adding address to Moralis stream:", error);
      throw error;
    }
  }

  async removeAddressFromStream(address) {
    try {
      if (!this.streamId) {
        throw new Error("Stream ID not configured");
      }

      await Moralis.Streams.deleteAddress({
        networkType: "evm",
        id: this.streamId,
        address: [address],
      });
    } catch (error) {
      console.error("Error removing address from Moralis stream:", error);
      throw error;
    }
  }
}

module.exports = new MoralisService();
