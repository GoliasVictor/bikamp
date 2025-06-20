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
import type { components } from "../lib/api/lastest";
import { toast } from 'sonner';
import { useApi } from '../clientApi';
import { PatchDevolverBicicletaCommand } from '../commands/concreteCommands';
import { SimuladorService } from '../commands/receivers';
import { useModal } from '../hooks/useModal';
import { json } from "stream/consumers";

function ResultadoInteracaoRaModal(props: { onOk: () => void, data: components["schemas"]["RespostaSolicitacaoEmprestimo"] }) {
  return <form className="flex flex-col border-2" onSubmit={props.onOk}>
    {JSON.stringify(props.data)}
    <div className="flex flex-row w-fill justify-between">
      <button className="m-2"> Confirmar </button>
    </div>
  </form>
}

export function DevolverBicicletaDialog() {
  const client = useApi()
  const modal = useModal()
  const simuladorService = new SimuladorService(client);
  const [open, setOpen] = useState(false);

  const [bicicletaId, setBicicletaId] = useState<number>(0);
  const [bicicletario_id, setBicicletarioId] = useState(0);
  const [pontoId, setPontoId] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("handleSubmit", bicicletaId, bicicletario_id);

    const command = new PatchDevolverBicicletaCommand(simuladorService, bicicletaId, bicicletario_id, pontoId);

    const result = await command.execute()
    setOpen(false);
    console.log("result", result);
    toast("Interação RA realizada com sucesso!",
      {
        description: JSON.stringify(result),
        
        action: {
          label: "Ok", onClick: () => console.log("Ok"),
        },
        duration: 2000,
      })

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
