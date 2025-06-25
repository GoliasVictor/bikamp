import '@/App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { BicicletariosService } from '@/lib/services';
import BicicletariosTable from '@/pages/bicicletarios/bicicletariosTable';

export default function BicicletariosPage() { 
  const api = useApi()
  const service = new BicicletariosService(api);

  const { data : bicicletarios, isLoading, error } = useQuery({
    queryKey: ["bicicletarios"], 
    queryFn: async () => await service.getBicicletarios()
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.name}</div>
  }

  return (
    <>
      <BicicletariosTable data={bicicletarios}/>
    </>
  );
}

