import { motion } from "framer-motion";
import { Settings, Bell, Shield, ChevronRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useWalletCreation } from "../hooks/useWalletCreation";
import { WETHBalance } from "../components/WETHBalance";

export function Profile() {
  const { address } = useAccount();
  const { wallet } = useWalletCreation();
  const maskPublicKey = (key: string) => {
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  const settings = [
    {
      category: "Trading Settings",
      items: [
        {
          title: "Moonbag Size",
          description: "Adjust the default size of your moonbags",
          icon: <Settings className="w-5 h-5" />,
        },
        {
          title: "Auto-Buy Threshold",
          description: "Set minimum requirements for automated purchases",
          icon: <Shield className="w-5 h-5" />,
        },
      ],
    },
    {
      category: "Notifications",
      items: [
        {
          title: "Alert Preferences",
          description: "Customize when and how you receive alerts",
          icon: <Bell className="w-5 h-5" />,
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <WETHBalance />

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Connected Wallets</h2>
        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Primary Wallet</h3>
                <p className="text-sm text-gray-400">
                  {address ? maskPublicKey(address) : "Not Connected"}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Connected
              </span>
            </div>
          </div>
          {wallet && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">AI Agent Wallet</h3>
                  <p className="text-sm text-gray-400">{wallet.address}</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {settings.map((section, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">{section.category}</h2>
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <motion.button
                key={itemIndex}
                whileHover={{ x: 4 }}
                className="w-full bg-gray-700/50 p-4 rounded-lg flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-600/50 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
