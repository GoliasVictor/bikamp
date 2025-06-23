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
import { PostInteracaoRaCommand } from '../commands/concreteCommands';
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

export function InteracaoRaDialog() {
  const client = useApi()
  const modal = useModal()
  const simuladorService = new SimuladorService(client);
  const [open, setOpen] = useState(false);

  const [ra, setRA] = useState<number | "">("");
  const [bicicletario_id, setBicicletarioID] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ra == "") {
      alert("Por favor, insira um RA válido.");
      return;
    }
    console.log("handleSubmit", ra, bicicletario_id);

    const postInteracaoRaCommand = new PostInteracaoRaCommand(simuladorService, ra, bicicletario_id);

    const result = await postInteracaoRaCommand.execute()
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
        <Button>Encostar RA</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Simulação de interação de RA com bicicletário</DialogTitle>
            <DialogDescription>
              Inisira o ra e o bicicletario que sera feito a interação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="ra">RA: </Label>
              <Input
                id="ra"
                type="number"
                required
                value={ra}
                onChange={(e) => setRA(Number(e.target.value))}
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
                onChange={(e) => setBicicletarioID(Number(e.target.value))}
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
