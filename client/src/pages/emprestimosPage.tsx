import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "./../lib/api/lastest"; 
import { useApi } from './../clientApi';
import { Link } from 'react-router';
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
        {emprestimos.map((t) =>
          <React.Fragment key={t.ciclista_ra?.toString()! + t.emprestimo_inicio?.toString()!}>
            <Link to={"/emprestimos/" + t.ciclista_ra + "/" + t.emprestimo_inicio?.toString() }>
              <p>{ t.ciclista_ra } - { t.emprestimo_inicio }</p>
            </Link>
          </React.Fragment>
        )} 
    </>
  )
}

