import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest"; 
import { useApi } from '../clientQuery';
import BicicletasTable from '@/components/bicicletasTable';
type Bicicleta = components["schemas"]["Bicicleta"];



function BicicletasPage() { 
  const api = useApi()
  const { data, error, isLoading } = api.useQuery("get", "/bicicletas") 
  
 
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) 
    return <div>Error: {error}</div>
  
  return (
    <>
        <BicicletasTable data={data}/>
    </>
  )
}

export default BicicletasPage
