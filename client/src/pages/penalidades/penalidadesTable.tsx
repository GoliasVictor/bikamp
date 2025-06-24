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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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


import { useQuery } from '@tanstack/react-query';
import { useApi } from "@/hooks/useApi"
import { TipoPenalidadeService } from "@/lib/services"
import { PenalidadeNovaDialog } from "./penalidadeNovaDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PerdoarPenalidadeDialog } from "./perdoarPenalidadeDialog"
 

export type Penalidade = components["schemas"]["Penalidade"]

export const columns: ColumnDef<Penalidade>[] = [
  {
    accessorKey: "penalidade_id",
    header:  ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identificador
          <ArrowUpDown />
        </Button>
      )
    },
    filterFn: 'includesString',
  },

  {
    accessorKey: "ciclista_ra",
    header: "RA",
    filterFn: 'includesString',
  },
  {
    accessorKey: "emprestimo_inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Emprestimo Inicio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase left">{new Date(row.getValue("emprestimo_inicio")).toLocaleString("br")}</div>,
  },
  {
    accessorKey: "penalidade_inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Penalidade Inicio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase left">{new Date(row.getValue("penalidade_inicio")).toLocaleString("br")}</div>,
  },
  {
    accessorKey: "tipo_penalidade_id",
    header: "Tipo Penalidade",
    cell: ({ row, table }) => {
      const meta = table.options.meta  as {
        tiposPenalidades: components["schemas"]["TipoPenalidade"][]
      }
      const tiposPenalidades = meta.tiposPenalidades
      const tipoPenalidade = tiposPenalidades.find(
        (t: any) => t.tipo_penalidade_id === row.getValue("tipo_penalidade_id")
      )
      return (
        <div>
          {tipoPenalidade ? tipoPenalidade.nome : "Desconhecido"}
        </div>
      )
    }
  },
  {
    id: "situacao",
    header: "Situacao",
    cell: ({ row }) => {
      const penalidadeFim = row.original.penalidade_fim
      const mantenedorId = row.original.mantenedor_id_perdoador
      return (
        <div className="capitalize">
          { !penalidadeFim || (new Date(penalidadeFim) < new Date(Date.now())) || row.original.mantenedor_id_perdoador
            ? (
              mantenedorId ? "Perdoada" : "Fechada"
            )
            : "Aberta"}
        </div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const penalidade = row.original
      return (
        <>
          { (penalidade.penalidade_fim && (new Date(penalidade.penalidade_fim) >= new Date(Date.now()))) && (<DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <PerdoarPenalidadeDialog penalidadeId={row.original.penalidade_id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>)}
        </>
      )
    },
  },


]

export default function PenalidadesTable({ data}: { data: any  }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const api = useApi()
  const service = new TipoPenalidadeService(api)
  
  const { data: tiposPenalidades } = useQuery({
    queryKey: ["tipos-penalidade"], 
    queryFn: async () => await service.getTiposPenalidade()
  })
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
      tiposPenalidades: tiposPenalidades || []
    }
  })

  return (
    <div className="flex items-center justify-center ">
      <div className="w-min flex-col">
        <div className="flex items-center justify-end py-4">
          <PenalidadeNovaDialog />
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
