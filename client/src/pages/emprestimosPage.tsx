import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "./../lib/api/lastest"; 
import { useApi } from '../clientQuery';
import { Link } from 'react-router';
import DataTableDemo from '@/components/mantenedores'
import { useQueryClient } from '@tanstack/react-query'
type Emprestimo = components["schemas"]["Emprestimo"];
  

export default function EmprestimosPage() {
  const client = useApi()
  const queryClient = useQueryClient();
  const { data, error, isLoading } = client.useQuery("get", "/emprestimos", {}, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <DataTableDemo data={data}/>
    </>
  )
}

