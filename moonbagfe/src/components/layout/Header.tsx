import { Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from '../WalletConnect';
import { useAccount } from 'wagmi';

export function Header() {
  const { isConnected } = useAccount();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Moonbag Agent</span>
            </Link>
            
            {isConnected && (
              <div className="hidden md:flex ml-10 space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
    </nav>
  );
}