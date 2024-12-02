import { Brain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "../WalletConnect";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export function Header() {
  const { isConnected } = useAccount();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Brain className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </motion.div>
              <span className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Moonbag
              </span>
            </Link>

            {isConnected && (
              <div className="hidden md:flex ml-10 space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      location.pathname === item.href
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <WalletConnect />
        </div>
      </div>
    </motion.nav>
  );
}
