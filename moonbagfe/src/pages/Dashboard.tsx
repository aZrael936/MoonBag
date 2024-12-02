import { motion } from 'framer-motion';
import { LineChart, Wallet, History } from 'lucide-react';
import { useMoonbagState } from '../hooks/useMoonbagState';
import { MoonbagChart } from '../components/charts/MoonbagChart';
import { TokenPerformance } from '../components/TokenPerformance';

export function Dashboard() {
  const { moonbags, transactions } = useMoonbagState();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Total Value Locked',
            value: '$2,456.78',
            icon: <Wallet className="w-6 h-6 text-blue-400" />,
            change: '+12.5%',
          },
          {
            title: 'Active Moonbags',
            value: '5',
            icon: <LineChart className="w-6 h-6 text-purple-400" />,
            change: '+2',
          },
          {
            title: 'Total Transactions',
            value: '24',
            icon: <History className="w-6 h-6 text-indigo-400" />,
            change: '+3',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-700/50 rounded-lg">{stat.icon}</div>
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
        <MoonbagChart />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Active Moonbags</h2>
          <div className="space-y-4">
            {moonbags.map((moonbag, index) => (
              <TokenPerformance
                key={index}
                token={moonbag.token}
                price={moonbag.value / moonbag.amount}
                change={moonbag.change}
                volume="$1.2M"
                marketCap="$45M"
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
            {transactions.map((tx, index) => (
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
                    <p className="text-sm text-gray-400">{tx.token}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${tx.value}</p>
                    <p className="text-sm text-gray-400">{tx.time}</p>
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