"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { COIN_GECKO_API_URL } from "@/utils/constants";
import { PortfolioDataType, usePortfolioStore } from "@/store/portfolioStore";
import { CoinDataByIdArrayType } from "@/types/CoinDataByIdTypes";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/userStore";
import { Input } from "./ui/input";


const getFavoriteCoinsDataFromCoinGecko = async (favCoinIds: string[]) => {
  let coinData: CoinDataByIdArrayType[] = [];
  let url = `${COIN_GECKO_API_URL}/coins/markets?vs_currency=usd&ids=`;
  const response = await fetch(url + favCoinIds.join(","));
  const data = await response.json();
  coinData.push(data);
  return coinData;
};

const columnHelper = createColumnHelper<PortfolioDataType>();

export default function PortfolioDataTable({
  favCoinIds,
}: {
  favCoinIds: string[];
}) {
  const supabase = createClient();

  const { data, isLoading, error, isSuccess  } = useQuery({
    queryKey: ["favoriteCoinsData"],
    queryFn: () => getFavoriteCoinsDataFromCoinGecko(favCoinIds),
  });

  useEffect(() => {
    if (data && isSuccess) {
      const fetchUserPortfolio = async () => {
        const { data: user_portfolio, error: user_portfolio_error } =
          await supabase.from("user_portfolio").select("*");
        if (user_portfolio_error) {
          console.error("Error fetching user portfolio:", user_portfolio_error);
          return;
        }

        const updatePortfolioStateData = data[0].map((coin) => {
          const userCoin = user_portfolio?.find((userCoin) => userCoin.coin_id === coin.id);
          return {
            id: coin?.id,
            symbol: coin?.symbol,
            name: coin?.name,
            image: coin?.image,
            current_price: coin?.current_price,
            holdings: userCoin ? userCoin.holding : 0,
            value_at_purchase: userCoin ? userCoin.value_at_purchase : 0,
            total_price_change: coin?.price_change_percentage_24h,
          };
        }) || [];

        console.log("Updated Portfolio State Data:", updatePortfolioStateData);

        usePortfolioStore.setState({ portfolioData: updatePortfolioStateData });

        const coin_ids = user_portfolio?.map((coin) => coin.coin_id);

        const newPortfolioData = data[0].filter(
          (coin) => !coin_ids?.includes(coin.id),
        );

        if (newPortfolioData.length > 0) {
          newPortfolioData.forEach(async (coin) => {
            const { data, error } = await supabase
            .from("user_portfolio")
            .insert([
              {
                coin_id: coin.id,
                holding: 0,
                user_id: useUserStore.getState().user?.id,
              },
            ])
            .select();
          if (error) {
            console.error("Error inserting coin into user_portfolio:", error);
          } else {
            console.log(
              "Successfully inserted coin into user_portfolio:",
              data,
            );
            }
          });
        } else {
          console.log("No new coins to add to user_portfolio");
        }
      };

      fetchUserPortfolio();
    }
  }, [data, isSuccess]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Coin",
        cell: ({ row }) => <div>{row.original.name}</div>,
      }),
      columnHelper.accessor("current_price", {
        header: "Price",
        cell: ({ row }) => <div>{row.original.current_price}</div>,
      }),
      columnHelper.accessor("holdings", {
        header: "Holdings",
        cell: ({ row }) => <Input className="w-25" type="number" value={row.original.holdings} onChange={(e) => {
          console.log(e.target.value)
        }}></Input>,
      }),
      columnHelper.accessor("value_at_purchase", {
        header: "Total USD",
        cell: ({ row }) => <div>{row.original.holdings * row.original.current_price}</div>,
      }),
      columnHelper.accessor("total_price_change", {
        header: "% Change",
        cell: ({ row }) => <div>{row.original.total_price_change}</div>,
      }),
    ],
    [data],
  );

  const table = useReactTable({
    columns,
    data: usePortfolioStore.getState().portfolioData || [],
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("Table Data:", usePortfolioStore.getState().portfolioData);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {
          isSuccess &&
          table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}