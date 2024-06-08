"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import currencyJs from "currency.js";
import Image from "next/image";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CoinMarketDataArrayType,
  CoinMarketDataType,
} from "@/types/coinMarketTypes";
import { Input } from "./ui/input";

import React from "react";
import { Checkbox } from "./ui/checkbox";

const columnHelper = createColumnHelper<CoinMarketDataType>();

const columns = [
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => (
      <Image
        src={info.getValue()}
        alt={info.getValue()}
        width={32}
        height={32}
      />
    ),
  }),

  columnHelper.accessor("name", {
    header: "Coin",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("current_price", {
    header: "Price",
    // cell: (info) => <span>${currency(info.getValue(), { precision: 2 })}</span>,
    cell: (info) => `$${info.getValue()}`,
  }),

  columnHelper.accessor("market_cap", {
    header: "Market Cap",
    cell: (info) => {
      let marketCap = currencyJs(info.getValue(), { separator: "," }).format();
      return `${marketCap}`;
    },
  }),
  columnHelper.accessor("total_volume", {
    header: "Volume",
    cell: (info) => {
      let volume = currencyJs(info.getValue(), { separator: "," }).format();
      return `${volume}`;
    },
  }),
  columnHelper.accessor("price_change_percentage_24h", {
    header: "Change",
    cell: ({ row }: { row: any }) => (
      <span
        className={`${row.original.price_change_24h < 0 ? "text-red-500" : "text-green-500"}`}
      >
        {row.original.price_change_percentage_24h.toFixed(2)}%
      </span>
    ),
  }),
  columnHelper.accessor("ath", {
    header: "ATH",
    cell: (info) => `$${info.getValue()}`,
  }),

  // I want to add favorite column
  {
    id: "isFavorite",
    header: "Favorite",
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.original.isFavorite}
        onChange={(event) => {
          // Update the isFavorite property when the checkbox is toggled

          row.original.isFavorite = !row.original.isFavorite;
        }}
      />
    ),
  },
];

export default function CoinMarketDataTable({
  data,
}: {
  data: CoinMarketDataArrayType;
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter coins..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
