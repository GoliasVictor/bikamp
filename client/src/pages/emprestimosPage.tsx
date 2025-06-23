import '../App.css' 
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import EmprestimosTable from '@/components/tables/emprestimosTable'
import { EmprestimosService } from '@/lib/services';
  

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

