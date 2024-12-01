const { Router } = require("express");
const {
  addWallet,
  removeWallet,
  listWallets,
  handleWebhook,
  regenerateInhouseWallet,
} = require("../controllers/walletController");

const router = Router();

router.post("/add", addWallet);
router.delete("/remove", removeWallet);
router.get("/list", listWallets);
router.post("/webhook", handleWebhook);
router.post("/regenerate-inhouse", regenerateInhouseWallet);

module.exports = router;
