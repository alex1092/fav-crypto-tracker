import CoinMarketDataTable from "@/components/CoinMarketDataTable";
import SignInSignOutButton from "@/components/SignInSignOutButton";
import { COIN_GECKO_COIN_MARKET_ENDPOINT } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

async function fetchCoinMarketData() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY || "",
    },
  };

  const res = await fetch(COIN_GECKO_COIN_MARKET_ENDPOINT, options);
  if (!res.ok) {
    throw new Error("Failed to fetch coin market data");
  }
  return res.json();
}

export default async function Home() {
  const coinMarketData = await fetchCoinMarketData();

  return (
    <main>
      <nav className="flex justify-end p-4 absolute top-0 right-0">
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

        <div className="mt-5 w-full p-10">
          <CoinMarketDataTable data={coinMarketData} />
        </div>
      </div>
    </main>
  );
}
