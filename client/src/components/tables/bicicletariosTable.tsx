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
import { ArrowUpDown, SquareArrowOutUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { components } from "@/lib/api/specs"
import { NavLink } from "react-router"
import { BicicletarioNovoDialog } from "../dialogs/bicicletarioNovoDialog"

 

export type Bicicletario = components["schemas"]["Bicicletario"]

export const columns: ColumnDef<Bicicletario>[] = [
    {
    id: "open",
    enableHiding: false,
    cell: ({ row }) => {
      const t = row.original

      return (
        <NavLink className="flex items-center justify-center" to={"/bicicletarios/" + t.id}>
          <Button variant="ghost">
            <SquareArrowOutUpRight/>
          </Button>
        </NavLink>
      )
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Identificacao
        <ArrowUpDown />
      </Button>
    ),
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    filterFn: 'includesString',
    id: "localizacao",
    header: ({}) => {
      return "Localizacao"
      
    },
    cell: ({ row: { original } }) => {
      return <div className="capitalize">({original.localizacao_latitude}, {original.localizacao_longitude} )</div>
    },
  },
  {
    accessorKey: "desativado",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ativado
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row: { original } }) => {
      return (
        <div className="capitalize center">{!original.desativado ? "Sim ":  "Nao"}</div>
      )
    },
  },
  {
    accessorKey: "pontos",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Q. Bicicletas
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row: { original } }) => {
      console.log(original.desativado )
      return (
        <div className="capitalize center">{original.pontos?.filter(p => p.bicicleta != null ).length }</div>
      )
    },
  }
]

export default function BicicletariosTable({ data}: { data: any  }) {
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
        <div className="flex items-center justify-end py-4">
          <BicicletarioNovoDialog/>
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
