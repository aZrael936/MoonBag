const express = require("express");
const cors = require("cors");
const { config } = require("./config/env");
const walletRoutes = require("./routes/walletRoutes");
const WebSocketService = require("./services/websocketService");

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  initializeRoutes() {
    this.app.use("/api/wallets", walletRoutes);
  }

  start() {
    this.app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
      const webhookUrl = `${config.WEBSOCKET_PORT}/api/wallets/webhook`;
      // Initialize WebSocket service
      new WebSocketService();
    });
  }
}

const app = new App();
app.start();
