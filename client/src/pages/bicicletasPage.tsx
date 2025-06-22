import '../App.css'
import { useApi } from '@/clientApi';
import { useQuery } from '@tanstack/react-query';
import BicicletasTable from '@/components/bicicletasTable';
import { BicicletaService } from '@/services/services';



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
