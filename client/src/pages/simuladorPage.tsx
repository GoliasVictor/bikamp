import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest";
import { useApi } from '../clientApi';
import { useModal } from '../hooks/useModal';
import { GetMantenedoresCommand, PostMantenedoresCommand } from '../commands/concreteCommands';
import { MantenedorService } from '../commands/receivers';
import EncostarRaModal from '../components/encostarRaModal';

type Mantenedor = components["schemas"]["Mantenedor"];
type Cargo = 1 | 2 | 3 | 4 | undefined;

export default function SimuladorPage() {
  const client = useApi()
  const modal = useModal()
  const mantenedorService = new MantenedorService(client);

  const openModal = () => {
    modal.setModal(
      <EncostarRaModal
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={false}
      />
    );
  }


  async function handleSubmit(mantenedor_id: number, nome: string, cargo: Cargo, senha: string) {
    const postMantenedoresCommand = new PostMantenedoresCommand(mantenedorService, mantenedor_id, nome, cargo, senha)
    if (await postMantenedoresCommand.execute()){
        modal.closeModal()
    }
  }

  function handleCancel() {
    modal.closeModal()
  }
 


  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ações do Simulador</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button type="submit" onClick={openModal}>Encostar RA</button>
      </div>
    </div>
  );
}

