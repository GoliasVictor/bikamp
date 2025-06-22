import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "../lib/api/specs"; 
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import EmprestimosTable from '@/components/tables/emprestimosTable'
import { useQueryClient } from '@tanstack/react-query'
import { EmprestimosService } from '@/lib/services';
type Emprestimo = components["schemas"]["Emprestimo"];
  

export default function EmprestimosPage() {
  const client = useApi()
  const emprestimoService = new EmprestimosService(client);
  const { data, error, isLoading } = useQuery({
    queryKey: ["emprestimos"],
    queryFn: async () => {
      return emprestimoService.getEmprestimos();
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <EmprestimosTable data={data}/>
    </>
  )
}

