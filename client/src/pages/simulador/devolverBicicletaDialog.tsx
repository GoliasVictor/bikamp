import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { useMutation } from '@tanstack/react-query';
import { SimuladorService } from '@/lib/services';
import { components } from "@/lib/api/specs";
import BicicletarioComboBox from "@/components/bicicletarioComboBox";
import BicicletaComboBox from "@/components/bicicletaComboBox";
import BicicletarioPontoComboBox from "@/components/bicicletarioPontoComboBox";



export function DevolverBicicletaDialog() {
  const client = useApi()
  const simuladorService = new SimuladorService(client);
  const [open, setOpen] = useState(false);

  const [bicicletaId, setBicicletaId] = useState<number| null>(null);
  const [bicicletario_id, setBicicletarioId] = useState<number | null>(null);
  const [pontoId, setPontoId] = useState<number | null>(null); 
  const { mutate, data } = useMutation({
    mutationFn: (data: components["schemas"]["RequestDevolucao"]) => {
      return simuladorService.patchDevolverBicicleta(data);
    },
    onSuccess: () => {
      setOpen(false);
      toast("Bicicleta devolvida com sucesso!",
      {
        description: JSON.stringify(data),
        
        action: {
          label: "Ok", onClick: () => console.log("Ok"),
        },
        duration: 2000,
      })
    }
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (bicicletaId === null || bicicletario_id === null || pontoId === null) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    mutate({
      bicicleta_id: bicicletaId,
      bicicletario_id: bicicletario_id,
      ponto_id: pontoId
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Encaixar Bicicleta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Simulação encaixe de bicicleta</DialogTitle>
            <DialogDescription>
              Indique o id da bicicleta e o bicicletario em que a bicicleta foi encaixada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="bicicleta_id">Bicicleta: </Label>
              <BicicletaComboBox
                value={bicicletaId}
                onChange={setBicicletaId}
                id="bicicleta_id"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="bicicletario">Bicicletário: </Label>
              <BicicletarioComboBox
                value={bicicletario_id}
                  onChange={(value) => setBicicletarioId(value)}
                  id="bicicletario"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="ponto_id">Ponto: </Label>
              <BicicletarioPontoComboBox
                bicicletarioId={bicicletario_id}
                value={pontoId}
                onChange={(value) => setPontoId(value)}
                id="ponto_id"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" >Salvar</Button>

          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
