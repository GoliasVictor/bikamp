"use client"

import * as React from "react"
import { SquareArrowOutUpRight } from "lucide-react"
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NavLink } from "react-router"



export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export type Emprestimo = {
  ciclista_ra: number,
  emprestimo_inicio: Date,
  emprestimo_fim: Date | null,
  bicicletario_id_devolvido: number | null,
  bicicletario_id_tirado: number,
  bicicleta_id: number
}
export const columns: ColumnDef<Emprestimo>[] = [
    {
    id: "open",
    enableHiding: false,
    cell: ({ row }) => {
      const t = row.original

      return (
        <NavLink className="flex items-center justify-center" to={"/emprestimos/" + t.ciclista_ra + "/" + t.emprestimo_inicio?.toString()}>
          <Button variant="ghost">
            <SquareArrowOutUpRight/>
          </Button>
        </NavLink>
      )
    },
  },
  {
    accessorKey: "ciclista_ra",
    header: "RA",
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("ciclista_ra")}</div>
    ),
  },
  {
    accessorKey: "emprestimo_inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inicio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase left">{new Date(row.getValue("emprestimo_inicio")).toUTCString()}</div>,
  },
  {
    accessorKey: "bicicleta_id",
    header: "Bicicleta",
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("bicicleta_id")}</div>
    ),
  },
  {
    accessorKey: "emprestimo_fim",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fim
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase left">{row.getValue("emprestimo_fim") ? new Date(row.getValue("emprestimo_fim")).toUTCString() : ""}</div>,
  },
  {
    accessorKey: "bicicletario_id_devolvido",
    header: "Devolvido em",
    cell: ({ row }) => (
      <div className="capitalize center">{row.getValue("bicicletario_id_devolvido")}</div>
    ),
  },

  {
    accessorKey: "bicicletario_id_tirado",
    header: "Pego em",
    cell: ({ row }) => (
      <div className="capitalize center">{row.getValue("bicicletario_id_tirado")}</div>
    ),
  },
]

export default function DataTableDemo({ data }: { data : any }) {
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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter ra..."
          value={(table.getColumn("ciclista_ra")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ciclista_ra")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> 
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
