import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "./../lib/api/v1"; 
import { useApi } from './../clientApi';
import { useParams } from 'react-router';
type Emprestimo = components["schemas"]["Emprestimo"];


function EmprestimoPage() {
  const [emprestimo, setEmprestimo] = useState<Emprestimo | null>()
  const { ra, date } = useParams();
  const client = useApi()

  useEffect(() => {
    
    client.GET("/emprestimos").then(res => {
      
      if (res.data != null) {
        let emp = res.data.find((e) => {
          return e.ciclista_ra == ra &&  e.emprestimo_inicio! == date
        })
        console.log(emp)
        setEmprestimo(emp);
      }

    });

  }, [])
  return (
    <>
      <pre><p className="left">{JSON.stringify(emprestimo, null, 4)}</p></pre>
      <br/>
      <button>Emprestar</button>
      <button>Editar</button>
      <button>Excluir</button>
    </>
  )
}

export default EmprestimoPage
