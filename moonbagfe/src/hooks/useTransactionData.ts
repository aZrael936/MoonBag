import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAccount } from "wagmi";
import { TransactionData } from "../types/api";

export function useTransactionData() {
  const { address } = useAccount();

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", address?.toLowerCase()],
    queryFn: async () => {
      if (!address) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("wallet_address", address.toLowerCase())
        .order("created_at", { ascending: false });

      console.log("daaata:", data);

      if (error) throw error;
      return data as TransactionData[];
    },
    enabled: !!address,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["transactionStats", address?.toLowerCase()],
    queryFn: async () => {
      if (!address) return null;

      const { data: txData, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("wallet_address", address.toLowerCase())
        .eq("status", "completed");

      if (error) throw error;

      const totalBuybackValue = txData.reduce(
        (sum, tx) => sum + tx.buyback_amount,
        0
      );
      const totalTransactions = txData.length;

      // Calculate average buyback percentage
      const avgBuybackPercentage =
        txData.reduce((sum, tx) => sum + tx.buyback_percentage, 0) /
        totalTransactions;

      // Group transactions by date for chart data
      const chartData = txData.reduce((acc: { [key: string]: number }, tx) => {
        const date = new Date(tx.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + tx.buyback_amount;
        return acc;
      }, {});

      return {
        totalValue: totalBuybackValue,
        valueChange: 0, // Calculate based on historical data if needed
        activeMoonbags: new Set(txData.map((tx) => tx.token_address)).size,
        moonbagChange: 0, // Calculate based on historical data if needed
        transactionChange: 0, // Calculate based on historical data if needed
        chartData: Object.entries(chartData).map(([date, value]) => ({
          date,
          value,
        })),
        avgBuybackPercentage,
      };
    },
    enabled: !!address,
  });

  return {
    transactions,
    stats,
    isLoading: isLoadingTransactions || isLoadingStats,
  };
}
