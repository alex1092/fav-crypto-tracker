import Image from "next/image";

import { COIN_GECKO_API_URL } from "@/utils/constants";

import DOMPurify from "isomorphic-dompurify";
import TotalsCard from "@/components/TotalsCard";
import { CoinDataTypes } from "@/types/CoinDataTypes";
import BackChevronButton from "@/components/BackChevronButton";
import currency from "currency.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Charts from "@/components/Charts";

export default async function Page({ params }: { params: { id: string } }) {
  const fetchCoinData = async () => {
    const res = await fetch(`${COIN_GECKO_API_URL}/coins/${params.id}`);
    const data = await res.json();
    if (!data) {
      return null;
    }
    return data;
  };

  const fetchChartData = async () => {
    const res = await fetch(
      `${COIN_GECKO_API_URL}/coins/${params.id}/market_chart?vs_currency=usd&days=7`
    );
    const data = await res.json();
    return data;
  };

  const chartData = await fetchChartData();

  const coinData: CoinDataTypes = await fetchCoinData();
  const cleanDescription = DOMPurify.sanitize(coinData.description.en);

  const getCurrentSentiment = () => {
    if (
      coinData.sentiment_votes_down_percentage <
      coinData.sentiment_votes_up_percentage
    ) {
      return <p className="text-green-500">Buy</p>;
    } else {
      return <p className="text-red-500">Sell</p>;
    }
  };

  if (!coinData) {
    return <div>Hmmm something went wrong...</div>;
  }
  return (
    <>
      <BackChevronButton />

      <div className="flex flex-col mt-10  h-screen">
        <div className="flex flex-row items-center justify-center sm:space-x-4  align-middle">
          <Image
            src={coinData.image.large}
            alt={coinData.name}
            width={40}
            height={40}
          />
          <h1 className="text-3xl text-left font-bold  ">{coinData.name}</h1>
        </div>
        <div className=" flex flex-col sm:flex-row p-4 space-y-4 sm:space-y-0 sm:justify-center sm:space-x-4">
          <TotalsCard
            title={"Current Price"}
            value={currency(coinData.market_data.current_price.usd, {
              symbol: "$",
              separator: ",",
            }).format()}
          />
          <TotalsCard
            title="Rank"
            value={coinData.market_data.market_cap_rank}
          />
          <TotalsCard
            title={"Price Change%"}
            value={coinData.market_data.price_change_percentage_24h}
            percentageChange
          />
          <TotalsCard
            title={"Market Cap"}
            value={currency(coinData.market_data.market_cap.usd, {
              symbol: "$",
              separator: ",",
            }).format()}
          />

          <Card>
            <CardHeader>
              <CardTitle>Current Sentiment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row justify-between align-middle">
              {getCurrentSentiment()}

              <div className="flex flex-col items-center">
                <ThumbsDown className="w-4 h-4" />
                {coinData.sentiment_votes_down_percentage}
              </div>
              <div className="flex flex-col items-center">
                <ThumbsUp className="w-4 h-4" />
                {coinData.sentiment_votes_up_percentage}
              </div>
            </CardContent>
          </Card>
        </div>

        {chartData && (
          <div className="border shadow-md rounded-md m-10">
            <p className="text-center text-sm mt-2 text-gray-500">
              Current price for 7 days
            </p>
            <div className="min-h-[300px] m-5">
              <Charts coinChartData={chartData} />
            </div>
          </div>
        )}

        <div className="p-4 sm:p-16 space-y-2">
          <p className="text-lg font-bold">About {coinData.name}</p>
          <p
            className=" font-light text-sm text-left "
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>
      </div>
    </>
  );
}
