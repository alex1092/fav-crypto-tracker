// import { COIN_GECKO_COIN_MARKET_ENDPOINT } from "@/utils/constants";

export async function GET(request: Request) {
  // const headers = new Headers({
  //   "Content-Type": "application/json",
  //   "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY || "",
  // });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-okyuQoPwv3dPJpzaHxHTp1pz",
    },
  };

  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

  const res = await fetch(url, options);
  const data = await res.json();

  return Response.json({ data });
}
