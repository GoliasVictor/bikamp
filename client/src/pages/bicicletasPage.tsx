import { useEffect, useState } from 'react'
import '../App.css'
import React from 'react'
import type { components } from "../lib/api/lastest"; 
import { useApi } from '../clientApi';
import { Link } from 'react-router';
import { GetBicicletasCommand} from '../commands/concreteCommands';
import { BicicletaService } from '../commands/receivers';

type Bicicleta = components["schemas"]["Bicicleta"];


function BicicletasPage() {
  const [todos, setTodos] = useState<Bicicleta[]>([])
  const client = useApi()

  const bicicletasService = new BicicletaService(client)
  const getBicicletasCommand = new GetBicicletasCommand(bicicletasService) 

  useEffect(() => {
    
    getBicicletasCommand.execute().then(res => {
      if(res != null)
        setTodos(res);

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
