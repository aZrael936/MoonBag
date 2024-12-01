const { Router } = require("express");
const {
  addWallet,
  removeWallet,
  listWallets,
  handleWebhook,
} = require("../controllers/walletController");

const router = Router();

router.post("/add", addWallet);
router.delete("/remove", removeWallet);
router.get("/list", listWallets);
router.post("/webhook", handleWebhook);

module.exports = router;
