import { useState, useEffect } from 'react';

interface Moonbag {
  token: string;
  amount: number;
  value: number;
  change: number;
}

interface Transaction {
  type: string;
  token: string;
  value: number;
  time: string;
}

export function useMoonbagState() {
  const [moonbags, setMoonbags] = useState<Moonbag[]>([
    { token: '$PEPE', amount: 1000000, value: 1200, change: 12.5 },
    { token: '$WOJAK', amount: 500000, value: 800, change: -5.2 },
    { token: '$DOGE', amount: 10000, value: 456.78, change: 3.4 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { type: 'Buy', token: '$PEPE', value: 1000, time: '2h ago' },
    { type: 'Sell', token: '$WOJAK', value: 750, time: '5h ago' },
    { type: 'Buy', token: '$DOGE', value: 450, time: '1d ago' },
  ]);

  // TODO: Implement real data fetching
  useEffect(() => {
    // Fetch real data here
  }, []);

  return {
    moonbags,
    transactions,
  };
}