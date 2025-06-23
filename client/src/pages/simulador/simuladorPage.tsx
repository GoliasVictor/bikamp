import { DevolverBicicletaDialog } from '@/pages/simulador/devolverBicicletaDialog';
import '@/App.css'

import { InteracaoRaDialog } from '@/pages/simulador/interacaoRaDialog';


export default function SimuladorPage() {

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ações do Simulador</h2>
      <div style={{ marginBottom: '1rem' }}>
        <InteracaoRaDialog></InteracaoRaDialog>
        <DevolverBicicletaDialog></DevolverBicicletaDialog>

      </div>
      
    </div>
  );
}

