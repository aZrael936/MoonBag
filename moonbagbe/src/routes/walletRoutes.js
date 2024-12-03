const { Router } = require("express");
const {
  addWallet,
  removeWallet,
  listWallets,
  getWallet,
  handleWebhook,
  regenerateInhouseWallet,
  updateMoonbagPercent,
} = require("../controllers/walletController");

const router = Router();

router.post("/add", addWallet);
router.delete("/remove", removeWallet);
router.post("/update", updateMoonbagPercent);
router.get("/get/:wallet_address", getWallet);

router.get("/list", listWallets);
router.post("/webhook", handleWebhook);
router.post("/regenerate-inhouse", regenerateInhouseWallet);

module.exports = router;
