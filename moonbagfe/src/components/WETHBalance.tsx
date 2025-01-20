import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { writeContract } from "@wagmi/core";
import { parseEther } from "viem";
import { config } from "../config/wagmi";

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export function WETHBalance() {
  const { address } = useAccount();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [addy, setAdy] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("inhouse_wallet_address, private_key")
        .eq("address", address?.toLowerCase())
        .single();

      if (data) {
        console.log("daataa:", data);
        setAdy(data.inhouse_wallet_address);
      } else {
        console.log("error:", error);
      }
    };

    fetchData();
  }, []);

  const { data: balance } = useBalance({
    address: addy as `0x${string}`,
    token: WETH_ADDRESS,
  });

  const { isPending } = useWriteContract();

  const handleDeposit = async () => {
    if (!amount) return;

    try {
      await writeContract(config, {
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "recipient", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ type: "bool" }],
          },
        ],
        address: WETH_ADDRESS,
        functionName: "transfer",
        args: [
          addy as `0x${string}`, // Replace with your recipient address
          parseEther(amount.toString()),
        ],
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsDepositModalOpen(false);
        setAmount("");
      }, 2000);
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">WETH Balance</h2>
              <p className="text-gray-400">Available for moonbag purchases</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDepositModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Deposit WETH
          </motion.button>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-2xl font-bold">{balance?.formatted} WETH</p>
          <p className="text-sm text-gray-400">
            ≈ $
            {balance?.value
              ? (Number(balance.formatted) * 3500).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isDepositModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative"
            >
              {!isSuccess ? (
                <>
                  <button
                    onClick={() => setIsDepositModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-semibold mb-4">Deposit WETH</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (ETH)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeposit}
                      disabled={!amount || isPending}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        "Confirming..."
                      ) : (
                        <>
                          Deposit
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-400">
                    Deposit Successful!
                  </h3>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
