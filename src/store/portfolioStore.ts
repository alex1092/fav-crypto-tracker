import { CoinDataByIdType } from "@/types/CoinDataByIdTypes";
import { create } from "zustand";

export type PortfolioDataType = {
  id: string;
  symbol: CoinDataByIdType["symbol"];
  name: CoinDataByIdType["name"];
  image: CoinDataByIdType["image"];
  current_price: number;
  holdings: number;
  value_at_purchase: number;
  total_price_change: CoinDataByIdType["price_change_percentage_24h"];
};

interface PortfolioState {
  portfolioData: PortfolioDataType[] | null;
  setPortfolioData: (portfolioData: PortfolioDataType[] | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolioData: null,
  setPortfolioData: (portfolioData: PortfolioDataType[] | null) =>
    set({ portfolioData }),
}));
