import { ConnectKitButton } from "connectkit";

export function WalletConnect() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return children;
}
