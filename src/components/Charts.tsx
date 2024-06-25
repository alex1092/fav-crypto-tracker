"use client";

import { CoinHistoricalChartDataTypes } from "@/types/CoinHistoricalChartDataTypes";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";

type ChartsProps = {
  coinChartData: CoinHistoricalChartDataTypes;
};

type PriceChart = {
  date: string | number | Date;
  price: number;
};

type Series = {
  label: string;
  data: PriceChart[];
};

export default function Charts({ coinChartData }: ChartsProps) {
  const theme = useTheme();

  const data: Series[] = [
    {
      label: "Price",
      data: coinChartData.prices.map(([date, price]) => ({
        date: new Date(date),
        price: price as number,
      })),
    },
  ];

  const primaryAxis = useMemo(
    (): AxisOptions<PriceChart> => ({
      getValue: (datum) => datum.date,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<PriceChart>[] => [
      {
        getValue: (datum) => datum.price,
        elementType: "line",
      },
    ],
    [],
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
        dark: theme.resolvedTheme === "dark",
      }}
    />
  );
}
