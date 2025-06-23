import '@/App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import BicicletasTable from '@/pages/bicicletas/bicicletasTable';
import { BicicletaService } from '@/lib/services';



function BicicletasPage() { 
  const api = useApi()
  const bicicletaService = new BicicletaService(api)
  const { data, error, isLoading } = useQuery({
    queryKey: ["bicicletas"],
    queryFn: async () => await bicicletaService.getBicicletas()
  }) 
 
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) 
    return <div>Error: {error.name}</div>
  
  return (
    <>
        <BicicletasTable data={data}/>
    </>
  )
}

export default BicicletasPage
