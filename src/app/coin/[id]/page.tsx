import BackChevronButton from "@/components/BackChevronButton";
import { CoinDataTypes } from "@/types/coinDataTypes";

import { COIN_GECKO_API_URL } from "@/utils/constants";

import DOMPurify from "isomorphic-dompurify";

export default async function Page({ params }: { params: { id: string } }) {
  const fetchCoinData = async () => {
    const res = await fetch(`${COIN_GECKO_API_URL}/coins/${params.id}`);
    const data = await res.json();
    return data;
  };

  const coinData: CoinDataTypes = await fetchCoinData();
  const cleanDescription = DOMPurify.sanitize(coinData.description.en);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BackChevronButton />

      <h1 className="text-3xl text-left font-bold mt-4 ">{coinData.name}</h1>
      <p className="text-xl ">{coinData.symbol}</p>
      <p className="text-lg ">${coinData.market_data.current_price.usd}</p>
      <div className="m-10 space-y-2">
        <p className="text-lg font-bold">About {coinData.name}</p>
        <p
          className=" font-light text-sm    "
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
      </div>
    </div>
  );
}
