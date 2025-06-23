import '../App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { data, useParams } from 'react-router';
import { EmprestimosService } from '../lib/services';



function EmprestimoPage() {
  const { ra: str_ra, date } = useParams();
  const client = useApi()
  if (!str_ra || !date || isNaN(parseInt(str_ra))) {
    throw new Error("Parâmetros 'ra' e 'date' são obrigatórios");
  }
  const ra = parseInt(str_ra);

  const mantenedorService = new EmprestimosService(client);
  const { data: emprestimo, error, isLoading } = useQuery({
    queryKey: ["emprestimos", { ra, date}],
    queryFn: async () => {
      const emprestimos = await mantenedorService.getEmprestimos()
      const emp = emprestimos.find((e) => {
          return e.ciclista_ra == ra &&  e.emprestimo_inicio! == date
      })

      if (!emp) {
        throw new Error("Empréstimo não encontrado para o RA e data fornecidos");
      }
      return emp 
    }
  })
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
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
