import '@/App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { PenalidadeService } from '@/lib/services';
import PenalidadesTable from '@/pages/penalidades/penalidadesTable';

export default function PenalidadesPage() { 
  const api = useApi()
  const service = new PenalidadeService(api);

  const { data : penalidades, isLoading, error } = useQuery({
    queryKey: ["penalidades"], 
    queryFn: async () => await service.getPenalidades()
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.name}</div>
  }

  return (
    <>
      <PenalidadesTable data={penalidades}/>
      
    </>
  );
}

