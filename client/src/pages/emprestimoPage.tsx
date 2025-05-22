import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "./../lib/api/v1"; 
import { useApi } from './../clientApi';
import { useParams } from 'react-router';
import { EmprestimosService, MantenedorService } from '../commands/receivers';
import { GetEmprestimosCommand } from '../commands/concreteCommands';

type Emprestimo = components["schemas"]["Emprestimo"];




function EmprestimoPage() {
  const [emprestimo, setEmprestimo] = useState<Emprestimo | null>()
  const { ra, date } = useParams();
  const client = useApi()


  const mantenedorService = new EmprestimosService(client);
  const getEmprestimoCommand = new GetEmprestimosCommand(mantenedorService);


  useEffect(() => {
    
    getEmprestimoCommand.execute().then(res => {
      
      if (res != null) {
        let emp = res.find((e) => {
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
