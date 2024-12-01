const WebSocket = require("ws");
const {
  addWallet,
  removeWallet,
  listWallets,
} = require("../controllers/walletController");

const WS_URL = "ws://localhost:4000";

// Test wallet addresses (Base Sepolia)
const TEST_ADDRESSES = ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"];

// Mock Express req/res objects
const createMockReqRes = (method, data = {}) => {
  const req = {
    body: data,
    method,
  };

  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.data = data;
      return this;
    },
  };

  return { req, res };
};

// Create WebSocket connection to listen for transactions
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
  console.log("WebSocket Connected");
});

ws.on("error", (error) => {
  console.error("WebSocket Error:", error);
});

ws.on("message", (data) => {
  try {
    const message = JSON.parse(data);
    console.log("New Transaction:", message);
  } catch (error) {
    console.error("Error parsing message:", error);
    console.log("Raw message:", data.toString());
  }
});

// Test functions
async function runTests() {
  try {
    // 1. List current wallets
    console.log("\nListing current wallets...");
    const { req: listReq, res: listRes } = createMockReqRes("GET");
    await listWallets(listReq, listRes);
    console.log("Current wallets:", listRes.data);

    // 2. Add a test wallet
    console.log("\nAdding test wallet...", TEST_ADDRESSES[0]);
    const { req: addReq, res: addRes } = createMockReqRes("POST", {
      address: TEST_ADDRESSES[0],
    });
    await addWallet(addReq, addRes);
    console.log("Add wallet response:", addRes.data);

    // 3. List wallets again to confirm addition
    console.log("\nListing wallets after addition...");
    const { req: listAfterReq, res: listAfterRes } = createMockReqRes("GET");
    await listWallets(listAfterReq, listAfterRes);
    console.log("Updated wallets:", listAfterRes.data);

    // Wait for some time to potentially receive transactions
    console.log("\nWaiting for transactions...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    // 4. Remove the test wallet
    console.log("\nRemoving test wallet...");
    const { req: removeReq, res: removeRes } = createMockReqRes("DELETE", {
      address: TEST_ADDRESSES[0],
    });
    await removeWallet(removeReq, removeRes);
    console.log("Remove wallet response:", removeRes.data);
  } catch (error) {
    console.error("Error in tests:", error);
  } finally {
    console.log("\nClosing WebSocket connection...");
    ws.close();
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\nClosing WebSocket connection...");
  ws.close();
  process.exit(0);
});

runTests();
