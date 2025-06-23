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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { useMutation } from '@tanstack/react-query';
import { SimuladorService } from '@/lib/services';
import { components } from "@/lib/api/specs";



export function DevolverBicicletaDialog() {
  const client = useApi()
  const simuladorService = new SimuladorService(client);
  const [open, setOpen] = useState(false);

  const [bicicletaId, setBicicletaId] = useState<number>(0);
  const [bicicletario_id, setBicicletarioId] = useState(0);
  const [pontoId, setPontoId] = useState<number>(0);
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
    mutate({
      bicicleta_id: bicicletaId,
      bicicletario_id: bicicletario_id,
      ponto_id: pontoId
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Devolver Bicicleta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Simulação devolução de bicicleta</DialogTitle>
            <DialogDescription>
              Indique o id da bicicleta e o bicicletario em que a bicicleta sera devolvida.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="bicicleta_id">Bicicleta: </Label>
              <Input
                id="bicicleta_id"
                type="number"
                required
                value={bicicletaId}
                onChange={(e) => setBicicletaId(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="bicicletario">Bicicletário: </Label>
              <Input
                id="bicicletario"
                type="number"
                required
                value={bicicletario_id}
                onChange={(e) => setBicicletarioId(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="ponto_id">Bicicletário: </Label>
              <Input
                id="ponto_id"
                type="number"
                required
                value={pontoId}
                onChange={(e) => setPontoId(Number(e.target.value))}
                style={{ width: "100%" }}
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
