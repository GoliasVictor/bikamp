import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "../lib/api/v1"; 
import { useApi } from '../clientApi';
import { Link } from 'react-router';
type Bicicleta = components["schemas"]["Bicicleta"];


function BicicletasPage() {
  const [todos, setTodos] = useState<Bicicleta[]>([])
  const client = useApi()

  useEffect(() => {
    
    client.GET("/bicicletas").then(res => {
      if(res.data != null)
        setTodos(res.data);

    });

  }, [])
  return (
    <>
        {todos.map((t) =>
          <React.Fragment key={t.id}>
            <Link to={"/bicicletas/" + t.id}>
              <p>{ t.id }</p>
            </Link>
          </React.Fragment>
        )} 
    </>
  )
}

export default BicicletasPage
