import { motion } from "framer-motion";
import { LineChart, Wallet, History } from "lucide-react";
import { useTransactionData } from "../hooks/useTransactionData";
import { MoonbagChart } from "../components/charts/MoonbagChart";
import { TokenPerformance } from "../components/TokenPerformance";
import { TokenData, TransactionData } from "../types/api";

export function Dashboard() {
  const { transactions, stats, isLoading } = useTransactionData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const totalValue = stats?.totalValue || 0;
  const activeMoonbags = stats?.activeMoonbags || 0;
  const totalTransactions = transactions?.length || 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Total Value Locked",
            value: `$${totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            icon: <Wallet className="w-6 h-6 text-blue-400" />,
            change: stats?.valueChange
              ? `${stats.valueChange > 0 ? "+" : ""}${stats.valueChange}%`
              : "0%",
          },
          {
            title: "Active Moonbags",
            value: activeMoonbags.toString(),
            icon: <LineChart className="w-6 h-6 text-purple-400" />,
            change: stats?.moonbagChange
              ? `${stats.moonbagChange > 0 ? "+" : ""}${stats.moonbagChange}`
              : "0",
          },
          {
            title: "Total Transactions",
            value: totalTransactions.toString(),
            icon: <History className="w-6 h-6 text-indigo-400" />,
            change: stats?.transactionChange
              ? `${stats.transactionChange > 0 ? "+" : ""}${
                  stats.transactionChange
                }`
              : "0",
          },
        ].map((stat, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-700/50 rounded-lg">{stat.icon}</div>
              <span
                className={`text-sm ${
                  stat.change.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
        <MoonbagChart data={stats?.chartData || []} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Active Moonbags</h2>
          <div className="space-y-4">
            {stats?.tokens?.map((token: TokenData, index: number) => (
              <TokenPerformance
                key={index}
                token={token.symbol}
                price={token.currentPrice}
                change={token.priceChange}
                volume={token.volume}
                marketCap={token.marketCap}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions?.map((tx: TransactionData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{tx.type}</h3>
                    <p className="text-sm text-gray-400">{tx.token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${tx.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
