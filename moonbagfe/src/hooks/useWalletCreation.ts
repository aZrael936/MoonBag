import { useState } from "react";
import { ethers } from "ethers";

interface WalletState {
  address: string;
  privateKey: string;
}

export const useWalletCreation = () => {
  const [wallet, setWallet] = useState<WalletState | null>(null);

  const createWallet = () => {
    const newWallet = ethers.Wallet.createRandom();
    const walletData = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
    };
    setWallet(walletData);
    console.log("New wallet created:", walletData);

    return walletData;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return {
    wallet,
    createWallet,
    copyToClipboard,
  };
};
