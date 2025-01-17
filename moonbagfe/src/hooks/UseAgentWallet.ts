import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { supabase } from "../lib/supabase";
import { encryptPrivateKey, decryptPrivateKey } from "../utils/encryption";
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
          .from("agent_wallets")
          .select("agent_address, encrypted_private_key")
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
          const decryptedPrivateKey = decryptPrivateKey(
            data.encrypted_private_key
          );
          setAgentWallet({
            address: data.agent_address,
            privateKey: decryptedPrivateKey,
          });
        }
      } catch (error) {
        console.error("Error fetching agent wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentWallet();
  }, [address]);

  const saveAgentWallet = async (wallet: AgentWallet) => {
    if (!address) return;
    console.log("----------------------");

    try {
      setIsLoading(true);
      const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

      const { data, error } = await supabase.from("agent_wallets").insert({
        user_address: address.toLowerCase(),
        agent_address: wallet.address,
        encrypted_private_key: encryptedPrivateKey,
      });
      if (data) {
        console.log("table-insertion:", data);
      }
      setAgentWallet(wallet);
      console.log("walletDataaaa:", wallet);
      console.log("address type:", typeof wallet.address);
      console.log("addresss:", wallet.address);

      // Register wallet with the API
      await addWallet.mutateAsync(wallet.address);

      if (error) throw error;
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
    saveAgentWallet,
  };
}
