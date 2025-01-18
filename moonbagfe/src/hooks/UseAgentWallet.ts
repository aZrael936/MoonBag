import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { supabase } from "../lib/supabase";
// import { encryptPrivateKey, decryptPrivateKey } from "../utils/encryption";
import { useWalletData } from "./useWalletData";

interface AgentWallet {
  address: string;
  privateKey: string;
}

export function useAgentWallet() {
  const { address } = useAccount();
  const [agentWallet, setAgentWallet] = useState<AgentWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addWallet } = useWalletData();

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const fetchAgentWallet = async () => {
      try {
        const { data, error } = await supabase
          .from("wallets")
          .select("inhouse_wallet_address, private_key")
          .eq("user_address", address.toLowerCase())
          .single();

        if (error) {
          if (error.code !== "PGRST116") {
            // Not found error
            throw error;
          }
          setAgentWallet(null);
          return;
        }

        if (data) {
          setAgentWallet({
            address: data.inhouse_wallet_address,
            privateKey: data.private_key,
          });
        }
      } catch (error) {
        console.error("Error fetching agent wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentWallet();
  }, []);

  const saveUserWallet = async () => {
    if (!address) return;
    console.log("----------------------");

    try {
      setIsLoading(true);

      // Register wallet with the API
      await addWallet.mutateAsync(address);
    } catch (error) {
      console.error("Error saving agent wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    agentWallet,
    isLoading,
    saveUserWallet,
    // fetchAgentWallet,
  };
}
