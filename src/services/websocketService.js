const { WebSocketServer } = require("ws");
const { config } = require("../config/env");

class WebSocketService {
  constructor() {
    this.wss = new WebSocketServer({ port: config.WEBSOCKET_PORT });
    this.clients = new Set();

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log("Client connected");

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log("Client disconnected");
      });
    });
  }

  broadcast(data) {
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        // OPEN state
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = WebSocketService;
