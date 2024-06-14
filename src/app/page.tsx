import CoinMarketDataTable from "@/components/CoinMarketDataTable";

import TotalsCard from "@/components/TotalsCard";
import {
  COIN_GECKO_COIN_MARKET_ENDPOINT,
  COIN_GECKO_GLOBAL_MARKET_DATA_ENDPOINT,
} from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import currency from "currency.js";
import { GlobalMarketArrayData } from "@/types/globalMarketType";
import { NavBar } from "@/components/NavBar";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY || "",
  },
};

async function fetchCoinMarketData() {
  const res = await fetch(COIN_GECKO_COIN_MARKET_ENDPOINT, options);
  if (!res.ok) {
    throw new Error("Failed to fetch coin market data");
  }
  return res.json();
}

async function fetchGlobalMarketData() {
  const res = await fetch(COIN_GECKO_GLOBAL_MARKET_DATA_ENDPOINT, options);
  if (!res.ok) {
    throw new Error("Failed to fetch global market data");
  }
  return res.json();
}

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const coinMarketData = await fetchCoinMarketData();
  const globalMarketData: GlobalMarketArrayData = await fetchGlobalMarketData();

  return (
    <main>
      <NavBar />
      <div className="flex flex-col items-center justify-start h-screen">
        <Image
          src={
            globalMarketData.data.market_cap_change_percentage_24h_usd < 0
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
            value={globalMarketData.data.active_cryptocurrencies}
          />
          <TotalsCard
            title="Total Market Cap"
            value={currency(globalMarketData.data.total_market_cap.usd, {
              separator: ",",
              precision: 2,
            }).format()}
          />

          <TotalsCard
            title="Total 24h Volume"
            value={currency(globalMarketData.data.total_volume.usd, {
              separator: ",",
              precision: 2,
            }).format()}
          />
          <TotalsCard
            title="Market Cap Change"
            value={globalMarketData.data.market_cap_change_percentage_24h_usd}
          />
        </div>

        <div className=" w-full px-10">
          <CoinMarketDataTable data={coinMarketData} user={user} />
        </div>
      </div>
    </main>
  );
}
