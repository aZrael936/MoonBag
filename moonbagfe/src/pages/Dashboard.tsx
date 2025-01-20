import { motion } from "framer-motion";
import { LineChart, Wallet, History, Percent, UserCircle } from "lucide-react";
import { useTransactionData } from "../hooks/useTransactionData";
import { MoonbagChart } from "../components/charts/MoonbagChart";
import { TransactionData } from "../types/api";
import { Link } from "react-router-dom";

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
  const avgBuybackPercentage = stats?.avgBuybackPercentage || 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Profile Button */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Total Buyback Value",
            value: `$${(totalValue / 1e18).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
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
            title: "Avg Buyback %",
            value: `${avgBuybackPercentage.toFixed(1)}%`,
            icon: <Percent className="w-6 h-6 text-indigo-400" />,
            change: "Last 30 days",
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
              <span className="text-sm text-gray-400">{stat.change}</span>
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
        <h2 className="text-xl font-semibold mb-4">Buyback History</h2>
        <MoonbagChart data={stats?.chartData || []} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions?.map((tx: TransactionData, index: number) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Buyback Transaction</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Token: {tx.token_address.slice(0, 6)}...
                    {tx.token_address.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Buyback: {tx.buyback_percentage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(tx.buyback_amount / 1e18).toFixed(4)} ETH
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
