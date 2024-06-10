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
import { ArrowUpDown, Star } from "lucide-react";

import Image from "next/image";
import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CoinMarketDataArrayType,
  CoinMarketDataType,
} from "@/types/coinMarketTypes";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // header: "Market Cap",
    cell: (info) => {
      let marketCap = currencyJs(info.getValue(), { separator: "," }).format();
      return `${marketCap}`;
    },
  }),
  columnHelper.accessor("total_volume", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      let volume = currencyJs(info.getValue(), { separator: "," }).format();
      return `${volume}`;
    },
  }),
  columnHelper.accessor("price_change_percentage_24h", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: { row: any }) => (
      <span
        className={`${row.original.price_change_24h < 0 ? "text-red-500" : "text-green-500"}`}
      >
        {row.original.price_change_percentage_24h.toFixed(2)}%
      </span>
    ),
  }),
  columnHelper.accessor("ath", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ATH
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => `$${info.getValue()}`,
  }),
];

export default function CoinMarketDataTable({
  data,
}: {
  data: CoinMarketDataArrayType;
  user: User;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // defines the favorite section of the data table

  // defines the table
  const table = useReactTable({
    data,
    columns: [...columns],
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
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
