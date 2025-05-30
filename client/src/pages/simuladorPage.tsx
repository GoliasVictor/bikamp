import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest";
import { useApi } from '../clientApi';
import { useModal } from '../hooks/useModal';
import {PostInteracaoRaCommand } from '../commands/concreteCommands';
import { SimuladorService } from '../commands/receivers';
import EncostarRaModal from '../components/encostarRaModal';

export default function SimuladorPage() {
  const client = useApi()
  const modal = useModal()
  const simuladorService = new SimuladorService(client);

  const openModal = () => {
    modal.setModal(
      <EncostarRaModal
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={false}
      />
    );
  }


  async function handleSubmit(ra: number, bicicletario: number ) {
    const postInteracaoRaCommand = new PostInteracaoRaCommand(simuladorService, ra, bicicletario);
    if (await postInteracaoRaCommand.execute()){
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

