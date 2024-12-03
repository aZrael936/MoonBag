const { Router } = require("express");
const {
  getTransactionsByWallet,
  getTransactionStats,
  getStatPerToken,
} = require("../controllers/transactionController");

const router = Router();

router.get("/:wallet_address", getTransactionsByWallet);

router.get("/stats/:wallet_address", getTransactionStats);

router.get("/stats/:wallet_address/:token_address", getStatPerToken);

module.exports = router;
