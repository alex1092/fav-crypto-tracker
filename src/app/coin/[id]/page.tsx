import BackChevronButton from "@/components/BackChevronButton";
import { CoinDataTypes } from "@/types/coinDataTypes";
import Image from "next/image";

import { COIN_GECKO_API_URL } from "@/utils/constants";

import DOMPurify from "isomorphic-dompurify";
import TotalsCard from "@/components/TotalsCard";

export default async function Page({ params }: { params: { id: string } }) {
  const fetchCoinData = async () => {
    const res = await fetch(`${COIN_GECKO_API_URL}/coins/${params.id}`);
    const data = await res.json();
    return data;
  };

  const coinData: CoinDataTypes = await fetchCoinData();
  const cleanDescription = DOMPurify.sanitize(coinData.description.en);

  return (
    <>
      <BackChevronButton />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-row items-center justify-center space-x-4 align-middle">
          <Image
            src={coinData.image.large}
            alt={coinData.name}
            width={40}
            height={40}
          />
          <h1 className="text-3xl text-left font-bold ">{coinData.name}</h1>
        </div>
        <p className="text-xl ">{coinData.symbol}</p>
        <div className=" flex flex-row space-x-4 p-4">
          <TotalsCard
            title={"Current Price"}
            value={coinData.market_data.current_price.usd}
          />
          <TotalsCard
            title={"Market Cap"}
            value={coinData.market_data.market_cap.usd}
          />
        </div>

        <div className="m-10 space-y-2">
          <p className="text-lg font-bold">About {coinData.name}</p>
          <p
            className=" font-light text-sm    "
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>
      </div>
    </>
  );
}
