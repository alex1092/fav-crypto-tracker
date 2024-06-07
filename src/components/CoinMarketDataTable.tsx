"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CoinMarketDataTableProps } from "@/types/coinMarketTypes";
import { Input } from "./ui/input";
import { useState } from "react";
import React from "react";

const columns = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }: { row: any }) => (
      <Image
        src={row.original.image}
        alt={row.original.name}
        width={32}
        height={32}
      />
    ),
  },
  {
    header: "Coin",
    accessorKey: "name",
  },
  {
    header: "Price",
    accessorKey: "current_price",
  },
  {
    header: "Market Cap",
    accessorKey: "market_cap",
  },
  {
    header: "Volume",
    accessorKey: "total_volume",
  },
  {
    header: "Change",
    accessorKey: "price_change_24h",
    cell: ({ row }: { row: any }) => (
      <span
        className={`${row.original.price_change_24h < 0 ? "text-red-500" : "text-green-500"}`}
      >
        {(row.original.price_change_24h / 100).toFixed(2)}%
      </span>
    ),
  },
  {
    header: "ATH",
    accessorKey: "ath",
  },
  // I want to add favorite column
  //   {
  //     id: "isFavorite",
  //     header: "Favorite",
  //     cell: ({ row }: { row: any }) => (
  //       <Checkbox
  //         checked={row.original.isFavorite}
  //         onChange={() => {
  //           // Update the isFavorite property when the checkbox is toggled
  //           row.original.isFavorite = !row.original.isFavorite;
  //         }}
  //       />
  //     ),
  //   },
];

export default function CoinMarketDataTable({
  data,
}: CoinMarketDataTableProps) {
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
