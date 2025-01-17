import { motion } from "framer-motion";
import { useState } from "react";
// import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useWalletCreation } from "../hooks/useWalletCreation";
import { useAgentWallet } from "../hooks/UseAgentWallet";
import { Copy, Check, Wallet, Eye, EyeOff } from "lucide-react";

export function Onboarding() {
  const navigate = useNavigate();
  const { wallet, createWallet, copyToClipboard } = useWalletCreation();
  const { isLoading, saveAgentWallet } = useAgentWallet();

  const [copied, setCopied] = useState({ address: false, privateKey: false });
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [tradingPercentage, setTradingPercentage] = useState(10);
  const [isAgentAccCreated, setIsAgentAccCreated] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const handleCopy = async (text: string, type: "address" | "privateKey") => {
    await copyToClipboard(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000);
  };

  const handleCreateWallet = async () => {
    console.log("walleeeet:", wallet);
    const newWallet = createWallet();
    console.log("newWallleet:", newWallet);
    await saveAgentWallet(newWallet);

    setIsCreatingWallet(false);

    setIsAgentAccCreated(true);
  };

  const handleSubmit = () => {
    console.log("pooda potta");
    // TODO: Store trading percentage preference
    navigate("/dashboard");
  };

  const maskPrivateKey = (key: string) => {
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handleCreateWalletWithLoading = async () => {
    await handleCreateWallet();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Setup Your Moonbag Agent
        </h2>

        <div className="space-y-6">
          {!isAgentAccCreated ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateWalletWithLoading}
              // disabled={isCreatingWallet}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center space-x-2"
            >
              {isCreatingWallet ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Generate AI Agent Wallet</span>
                </>
              )}
            </motion.button>
          ) : (
            <>
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    AI Agent Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-800 p-2 rounded font-mono text-sm">
                      {wallet?.address}
                    </code>
                    <button
                      onClick={() =>
                        wallet?.address && handleCopy(wallet.address, "address")
                      }
                      className="p-2 hover:bg-gray-700 rounded"
                    >
                      {copied.address ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Private Key (Keep this safe!)
                    </label>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                    >
                      {showPrivateKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-800 p-2 rounded font-mono text-sm select-none">
                      {showPrivateKey
                        ? wallet?.privateKey
                        : wallet?.privateKey
                        ? maskPrivateKey(wallet.privateKey)
                        : ""}
                    </code>
                    <button
                      onClick={() =>
                        wallet?.privateKey &&
                        handleCopy(wallet.privateKey, "privateKey")
                      }
                      className="p-2 hover:bg-gray-700 rounded"
                      title="Copy private key"
                    >
                      {copied.privateKey ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-red-400">
                    Never share your private key with anyone!
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Moonbag Size (% of trade amount)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={tradingPercentage}
                    onChange={(e) =>
                      setTradingPercentage(Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="text-center text-lg font-semibold">
                    {tradingPercentage}%
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                >
                  Complete Setup
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
