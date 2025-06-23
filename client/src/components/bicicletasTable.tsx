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
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react"

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
import { StatusBicicleta } from "@/lib/statusBicicleta"
import { EditarBicicletaDialog } from "./editarBicicletaDialog"
import { NovaBicicletaDialog } from "./novaBicicletaDialog"



export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export type Emprestimo = {
  id: number,
  status: number,
  bicicleta_patrimonio: string,
}
export const columns: ColumnDef<Emprestimo>[] = [

  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "bicicleta_patrimonio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patrimônio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("bicicleta_patrimonio")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{(new StatusBicicleta(row.getValue("status"))).toString()}</div>,
  },
  {
    accessorKey: "bicicletario",
    header: "Bicicletário",
    cell: ({ row }) => (
      <div className="capitalize center">{row.getValue("bicicletario")}</div>
    ),
  },

  {
    accessorKey: "ponto",
    header: "Ponto",
    cell: ({ row }) => (
      <div className="capitalize center">{row.getValue("ponto")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const bicicleta = row.original
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <EditarBicicletaDialog bicicletaId={bicicleta.id} default={bicicleta} onUpdated={table.options.meta!.onUpdated} />
        </Button>
      )
    },
  },
]

export default function BicicletasTable({ data, onUpdated }: { data: any, onUpdated: () => void }) {
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
    },
    meta: {
      onUpdated
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between  py-4">
        <Select onValueChange={
          (str) =>
            table.getColumn("status")?.setFilterValue(str)
        }
          defaultValue={
            (table.getColumn("status")?.getFilterValue() as string) ?? ""
          }>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar status bicicleta " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"null"}>
              Todos
            </SelectItem>

            {
              StatusBicicleta.allStatuses().map(([cd, str]) => (
                <SelectItem key={cd} value={cd.toString()}>
                  {str}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <NovaBicicletaDialog onUpdated={onUpdated} />
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
  )
}
