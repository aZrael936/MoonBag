const express = require("express");
const cors = require("cors");
const { config } = require("./config/env");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const WebSocketService = require("./services/websocketService");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

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
    this.app.use("/api/transaction", transactionRoutes);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
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
