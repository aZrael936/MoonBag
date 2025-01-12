export interface WalletStats {
  totalValue: number;
  valueChange: number;
  activeMoonbags: number;
  moonbagChange: number;
  transactionChange: number;
  chartData: ChartData[];
  tokens: TokenData[];
}

export interface ChartData {
  date: string;
  value: number;
}

export interface TokenData {
  address: string;
  symbol: string;
  currentPrice: number;
  priceChange: number;
  volume: string;
  marketCap: string;
}

export interface TransactionData {
  type: "buy" | "sell";
  token: {
    address: string;
    symbol: string;
  };
  value: number;
  timestamp: string;
}
