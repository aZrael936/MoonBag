import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletsApi, WalletData } from "../lib/api";
import { useAccount } from "wagmi";

export function useWalletData() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet", address],
    queryFn: () =>
      address ? walletsApi.get(address).then((res) => res.data) : null,
    enabled: !!address,
  });

  const addWallet = useMutation({
    mutationFn: (walletAddress: string) => walletsApi.add(walletAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", address] });
    },
  });

  const updateMoonbagPercentage = useMutation({
    mutationFn: ({
      walletAddress,
      percentage,
    }: {
      walletAddress: string;
      percentage: number;
    }) => walletsApi.update(walletAddress, percentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", address] });
    },
  });

  return {
    walletData,
    isLoading,
    addWallet,
    updateMoonbagPercentage,
  };
}
