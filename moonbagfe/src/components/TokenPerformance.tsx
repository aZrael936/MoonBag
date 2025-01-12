import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenPerformanceProps {
  token: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

export function TokenPerformance({
  token,
  price,
  change,
  volume,
  marketCap,
}: TokenPerformanceProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{token}</h3>
        <div
          className={`flex items-center gap-1 ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change.toFixed(2)}%</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">Price</p>
          <p className="font-medium">${price.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Volume</p>
          <p className="font-medium">{volume}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="font-medium">{marketCap}</p>
        </div>
      </div>
    </motion.div>
  );
}
