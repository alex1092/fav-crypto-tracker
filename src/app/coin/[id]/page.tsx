import BackChevronButton from "@/components/BackChevronButton";
import { CoinDataTypes } from "@/types/coinDataTypes";

import { COIN_GECKO_API_URL } from "@/utils/constants";

import DOMPurify from "isomorphic-dompurify";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const fetchCoinData = async () => {
    const res = await fetch(`${COIN_GECKO_API_URL}/coins/${params.id}`);
    const data = await res.json();
    return data;
  };

  const coinData: CoinDataTypes = await fetchCoinData();
  const cleanDescription = DOMPurify.sanitize(coinData.description.en);

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <BackChevronButton />
      <h1 className="text-2xl">{coinData.name}</h1>
      <p>{coinData.symbol}</p>
      <p>{coinData.market_data.current_price.usd}</p>
      <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
    </div>
  );
}
