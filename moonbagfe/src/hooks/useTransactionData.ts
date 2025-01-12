import { useQuery } from "@tanstack/react-query";
import { transactionsApi, Transaction, TokenStats } from "../lib/api";
import { useAccount } from "wagmi";

export function useTransactionData() {
  const { address } = useAccount();

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      address
        ? transactionsApi.getForWallet(address).then((res) => res.data)
        : [],
    enabled: !!address,
  });
  console.log("transactions:", transactions);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["transactionStats", address],
    queryFn: () =>
      address
        ? transactionsApi.getStats(address).then((res) => res.data)
        : null,
    enabled: !!address,
  });

  return {
    transactions,
    stats,
    isLoading: isLoadingTransactions || isLoadingStats,
  };
}
