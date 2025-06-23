import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "./../lib/api/lastest"; 
import { useApi } from './../clientApi';
import { Link } from 'react-router';
import DataTableDemo from '@/components/mantenedores'

type Emprestimo = components["schemas"]["Emprestimo"];
  

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const client = useApi()

  useEffect(() => {
    
    client.GET("/emprestimos").then(res => {
      
      if (res.data != null) {
        setEmprestimos(res.data);
      }

    });

  }, [])
  return (
    <>
      <DataTableDemo data={emprestimos}/>
    </>
  )
}

