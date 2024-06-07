export type MarketDataType = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  fullyDilutedValuation: number | null;
  totalVolume: number;
  high24H: number;
  low24H: number;
  priceChange24H: number;
  priceChangePercentage24H: number;
  marketCapChange24H: number;
  marketCapChangePercentage24H: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number;
  athChangePercentage: number;
  athDate: Date;
  atl: number;
  atlChangePercentage: number;
  atlDate: Date;
  roi: Roi | null;
  lastUpdated: Date;
};

export type Roi = {
  times: number;
  currency: Currency;
  percentage: number;
};

export enum Currency {
  Btc = "btc",
  Eth = "eth",
  Usd = "usd",
}
