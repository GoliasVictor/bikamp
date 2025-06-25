import '@/App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { MantenedorService } from '@/lib/services';
import MantenedoresTable from '@/pages/mantenedores/mantenedoresTable';

export default function MantenedoresPage() { 
  const api = useApi()
  const mantenedorService = new MantenedorService(api);

  const { data : mantenedores, isLoading, error } = useQuery({
    queryKey: ["mantenedores"], 
    queryFn: async () => await mantenedorService.getMantenedores()
  })
  

   

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.name}</div>
  }

  return (
    <>
      <MantenedoresTable data={mantenedores}/>
    </>
  );
}

