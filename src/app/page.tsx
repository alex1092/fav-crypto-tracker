import CoinMarketDataTable from "@/components/CoinMarketDataTable";
import { ModeToggle } from "@/components/ModeToggle";
import SignInSignOutButton from "@/components/SignInSignOutButton";
import TotalsCard from "@/components/TotalsCard";
import {
  COIN_GECKO_COIN_MARKET_ENDPOINT,
  COIN_GECKO_GLOBAL_MARKET_DATA_ENDPOINT,
} from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

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

  if (!user) {
    return redirect("/auth");
  }

  const coinMarketData = await fetchCoinMarketData();
  const globalMarketData = await fetchGlobalMarketData();

  return (
    <main>
      <nav className="flex justify-end p-4 absolute top-0 space-x-3 right-0">
        <ModeToggle />
        <SignInSignOutButton />
      </nav>
      <div className="flex flex-col items-center justify-start h-screen">
        <Image
          src="/wojak.png"
          alt="Making it rain"
          width={150}
          height={150}
          className="mt-10 pb-3"
        />
        <h1 className="text-4xl font-bold">Crypto tracker</h1>
        <p className="text-2xl font-bold">Track your favorite coins</p>

        <div className="flex flex-row justify-center gap-4 w-full pt-4">
          <TotalsCard
            title="Active Cryptocurrencies"
            value={globalMarketData.data.active_cryptocurrencies}
          />
          <TotalsCard
            title="Total Market Cap"
            value={globalMarketData.data.total_market_cap.usd}
          />

          <TotalsCard
            title="Total 24h Volume"
            value={globalMarketData.data.total_volume.usd}
          />
          <TotalsCard
            title="Market Cap Change"
            value={globalMarketData.data.market_cap_change_percentage_24h_usd}
          />
        </div>

        <div className=" w-full px-10">
          <CoinMarketDataTable data={coinMarketData} />
        </div>
      </div>
    </main>
  );
}
