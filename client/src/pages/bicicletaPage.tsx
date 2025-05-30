import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest"; 
import { useApi } from '../clientApi';
import { useParams } from 'react-router';
type Bicicleta = components["schemas"]["Bicicleta"];


function BicicletasPage() {

  const [bicicleta, setBicicleta] = useState<Bicicleta | null>()
  const { id } = useParams();
  const client = useApi()

  useEffect(() => {
    
    client.GET("/bicicletas/{id}", {
      params: {
        path: {
         id: parseInt(id!)
        }
     }
  }).then(res => {
      if(res.data != null)
        setBicicleta(res.data);

    });

  }, [])

  
  return (
    <>
      <pre><p className="left">{JSON.stringify(bicicleta, null, 4)}</p></pre> 
    </>
  )
}

export default BicicletasPage
