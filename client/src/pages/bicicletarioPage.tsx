import '@/App.css'
import { useApi } from '@/hooks/useApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BicicletariosService } from '@/lib/services';
import BicicletariosTable from '@/components/tables/bicicletariosTable';
import { Navigate, useParams } from 'react-router';
import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PontosTable from '@/components/tables/pontosTable';
import { Button } from '@/components/ui/button';
import { PontoNovoDialog } from '@/components/dialogs/pontoNovoDialog';
import { Trash } from 'lucide-react';
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';

export default function BicicletariosPage() {
  const api = useApi()
  const [errorNotFound, setErrorNotFound] = useState(false)

  const { id: idStr } = useParams();
  if (!idStr) {
    return "Pagina nao encontrada"
  }
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return "Pagina nao encontrada"
  }
  const queryClient = useQueryClient();
  const service = new BicicletariosService(api);
  const { data: bicicletario, isLoading, error } = useQuery({
    queryKey: ["bicicletarios", { id: id }],
    queryFn: async () => {
      const data = await service.getBicicletarios()

      const bicicletario = data.find((b) => {
        return b.id == id
      })
      if (!bicicletario) {
        setErrorNotFound(true)
      }
      return bicicletario
    }
  })

  const { mutate: mutateDesativar } = useMutation({
    mutationFn: async () => {
      return service.deleteBicicletario(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bicicletarios"] });
      setConfirmOpen(false);
    },
    onError: (error) => {
      toast.error("Erro ao desativar bicicletário: " + error.message);
    }
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDesativar = (..._ : any[]) => {
    mutateDesativar();
  }
  if (errorNotFound) {
    return <Navigate to="/bicicletarios" />

  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.name}</div>
  }
  if (!bicicletario) {
    return <Navigate to="/bicicletarios" />
  }
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <Card className='w-sm h-min'>
          <CardHeader>
            <CardTitle>
              Bicicletário {bicicletario!.id}
            </CardTitle>
          </CardHeader>
          <CardContent className='text-left'>
            Latitude: {bicicletario.localizacao_latitude}<br />
            Longitude: {bicicletario.localizacao_longitude}<br />
            {bicicletario.desativado && (
              <Alert className='mt-4'>
                <Trash />
                <AlertTitle>Este bicicletario foi desativado</AlertTitle>
              </Alert>
            )}
          </CardContent>
          {!bicicletario.desativado && (
            <CardFooter>
              <CardAction className='flex flex-row gap-2'>
                <PontoNovoDialog bicicletario_id={id} />
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Desativar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='w-sm'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá desativar permanentemente este bicicletário.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     
                      <Button variant="destructive" onClick={handleDesativar}>
                        Desativar
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
              </CardAction>
            </CardFooter>
          )}
        </Card>
        <Card className='w-min'>
          <CardHeader >
            <CardTitle>
              Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PontosTable data={bicicletario!.pontos} bicicletario_id={bicicletario!.id} desativado={bicicletario.desativado} />

          </CardContent>
        </Card>
      </div>
    </>
  );
}

