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

import { useQuery } from '@tanstack/react-query';
import { useApi } from "@/hooks/useApi"
import { TipoPenalidadeService } from "@/lib/services"
 

export type Penalidade = components["schemas"]["Penalidade"]

export const columns: ColumnDef<Penalidade>[] = [
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
          Emprestimo Inicio
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase left">{new Date(row.getValue("emprestimo_inicio")).toLocaleString()}</div>,
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
    cell: ({ row }) => <div className="lowercase left">{new Date(row.getValue("penalidade_inicio")).toLocaleString()}</div>,
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
          {tipoPenalidade ? tipoPenalidade.descricao : "Desconhecido"}
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
          {penalidadeFim
            ? (
              mantenedorId ? "Fechada (Perdoada)" : "Fechada"
            )
            : "Aberta"}
        </div>
      )
    }
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
  
  const { data: tiposPenalidades, isLoading, error } = useQuery({
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
          <Button variant="link">
            <NavLink to="/penalidades/novo" className="flex items-center">
              <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
              Nova Penalidade
            </NavLink>
          </Button>
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
