import { ConnectKitButton } from 'connectkit';

export function WalletConnect() {
  return (
    <ConnectKitButton />
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return children;
}