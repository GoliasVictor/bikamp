import { DevolverBicicletaDialog } from '@/pages/simulador/devolverBicicletaDialog';
import '@/App.css'

import { InteracaoRaDialog } from '@/pages/simulador/interacaoRaDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function SimuladorPage() {

  return (
    <Card className='h-min w-sm'>
      <CardHeader>
        <CardHeader className='flex flex-col items-center'>
          <CardTitle>
            Simulador de Bicicletário
          </CardTitle>
          <CardDescription>
            Simule a interação com o bicicletário e as bicicletas usando RA.
          </CardDescription>
        </CardHeader>

      </CardHeader>
      <CardContent>
      <div className='flex gap-4 flex-col'>
        <InteracaoRaDialog></InteracaoRaDialog>
        <DevolverBicicletaDialog></DevolverBicicletaDialog>

      </div>
      
        
      </CardContent>
    </Card>
  );
}

