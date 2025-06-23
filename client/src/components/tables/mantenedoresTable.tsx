"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { components } from "@/lib/api/specs"
import cargos from "@/lib/cargos"
import { MantenedorNovoDialog } from "../dialogs/mantenedorNovoDialog"

 

export type Mantenedor = components["schemas"]["Mantenedor"]

export const columns: ColumnDef<Mantenedor>[] = [
  {
    accessorKey: "mantenedor_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Identiicacao
        <ArrowUpDown />
      </Button>
    ),
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("mantenedor_id")}</div>
    ),
  },
  {
    filterFn: 'includesString',
    accessorKey: "cargo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cargo
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{cargos.cargoToString(row.getValue("cargo"))}</div>,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize center">{row.getValue("nome")}</div>
    ),
  }
]

export default function MantenedoresTable({ data}: { data: any  }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className="flex items-center justify-center ">
      <div className="w-min flex-col">
        <div className="flex items-center justify-between py-4">
          <Select onValueChange={
            (str) => {
              if (str === "null") {
                table.getColumn("cargo")?.setFilterValue(undefined)
              }
              else {
                table.getColumn("cargo")?.setFilterValue(str)
              }
            }
          }
            defaultValue={
              (table.getColumn("cargo")?.getFilterValue() as string) ?? ""
            }>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar status bicicleta " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"null"}>
                Todos
              </SelectItem>

              {
                cargos.allCargos().map(([cd, str]) => (
                  <SelectItem key={cd} value={cd.toString()}>
                    {str}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          
          <MantenedorNovoDialog/>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
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
    </div>
      
  )
}
