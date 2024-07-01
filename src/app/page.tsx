import CoinMarketDataTable from "@/components/CoinMarketDataTable";
import TotalsCard from "@/components/TotalsCard";
import {
  COIN_GECKO_COIN_MARKET_ENDPOINT,
  COIN_GECKO_GLOBAL_MARKET_DATA_ENDPOINT,
} from "@/utils/constants";
import Image from "next/image";
import currency from "currency.js";
import { GlobalMarketArrayData } from "@/types/globalMarketType";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY || "",
  },
};

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(endpoint, options);
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function Home() {
  const [coinMarketData, globalMarketData] = await Promise.all([
    fetchData(COIN_GECKO_COIN_MARKET_ENDPOINT),
    fetchData(COIN_GECKO_GLOBAL_MARKET_DATA_ENDPOINT),
  ]);

  const {
    data: {
      active_cryptocurrencies,
      total_market_cap,
      total_volume,
      market_cap_change_percentage_24h_usd,
    },
  } = globalMarketData as GlobalMarketArrayData;

  return (
    <main>
      <div className="flex flex-col items-center justify-start h-screen">
        <Image
          src={
            market_cap_change_percentage_24h_usd < 0
              ? "/red-wojak.png"
              : "/wojak.png"
          }
          alt="wojack"
          width={75}
          height={75}
          className="mt-10 pb-3"
        />
        <h1 className="text-4xl font-bold">Crypto tracker</h1>
        <p className="text-2xl font-bold">Track your favorite coins</p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 w-full pt-4 px-4 sm:px-0">
          <TotalsCard
            title="Active Cryptocurrencies"
            value={active_cryptocurrencies}
          />
          <TotalsCard
            title="Total Market Cap"
            value={currency(total_market_cap.usd, {
              separator: ",",
              precision: 2,
            }).format()}
          />
          <TotalsCard
            title="Total 24h Volume"
            value={currency(total_volume.usd, {
              separator: ",",
              precision: 2,
            }).format()}
          />
          <TotalsCard
            title="Market Cap Change"
            value={market_cap_change_percentage_24h_usd}
          />
        </div>

        <div className="w-full px-10">
          <CoinMarketDataTable data={coinMarketData} />
        </div>
      </div>
    </main>
  );
}
