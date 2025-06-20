import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest"; 
import { useApi } from '../clientApi';
import { GetBicicletasCommand} from '../commands/concreteCommands';
import { BicicletaService } from '../commands/receivers';
import BicicletasTable from '@/components/bicicletasTable';

type Bicicleta = components["schemas"]["Bicicleta"];


function BicicletasPage() {
  const [bicicletas, setBicicletas] = useState<Bicicleta[]>([])
  const client = useApi()

  const bicicletasService = new BicicletaService(client)
  const getBicicletasCommand = new GetBicicletasCommand(bicicletasService) 

  useEffect(() => {
    
    getBicicletasCommand.execute().then(res => {
      if(res != null)
        setBicicletas(res);

    });

  }, [])

  function handleBicicletasUpdated() {    
    getBicicletasCommand.execute().then(res => {
      if (res != null)
        setBicicletas(res);

    });
  }
  return (
    <>
        <BicicletasTable data={bicicletas} onUpdated={handleBicicletasUpdated}/>
    </>
  )
}

export default BicicletasPage
