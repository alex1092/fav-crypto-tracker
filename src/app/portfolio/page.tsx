import PortfolioDataTable from "@/components/PortfolioDataTable";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

const favoriteCoins = async () => {
  let { data: favorite_coins, error } = await supabase
    .from("favorite_coins")
    .select("*");
  return { favorite_coins, error };
};

export default async function Portfolio() {
  const data = await favoriteCoins();
  const favCoinIds = data?.favorite_coins?.[0].coin_id;

  return (
    <div className="flex container flex-col mt-5">
      <h1 className="text-4xl font-bold">Portfolio</h1>
      <p>Welcome to your portfolio</p>

      {favCoinIds ? (
        <PortfolioDataTable favCoinIds={favCoinIds} />
      ) : (
        <p>No favorite coins yet, add some to your portfolio to get started</p>
      )}
    </div>
  );
}
