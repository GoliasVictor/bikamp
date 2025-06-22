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
import type { components } from "../lib/api/specs";
import { toast } from 'sonner';
import { useApi } from '../clientApi';
import { SimuladorService } from '../services/services';
import { useModal } from '../hooks/useModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { json } from "stream/consumers";


export function InteracaoRaDialog() {
  const client = useApi()
  const modal = useModal()
  const simuladorService = new SimuladorService(client);
  const [open, setOpen] = useState(false);

  const [ra, setRA] = useState<number | "">("");
  const [bicicletario_id, setBicicletarioID] = useState(0);
  const queryClient = useQueryClient();
  const { mutate , data} = useMutation({
    mutationFn: (data: components["schemas"]["RequesicaoEmprestimo"]) => {
      return simuladorService.postInteracaoRa(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bicicletas"] });
      queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
      setOpen(false);
      console.log("result", data);
      toast("Interação RA realizada com sucesso!",
      {
        description: JSON.stringify(data),
        
        action: {
          label: "Ok", onClick: () => console.log("Ok"),
        },
        duration: 2000,
      })
    },
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ra == "") {
      alert("Por favor, insira um RA válido.");
      return;
    }
    console.log("handleSubmit", ra, bicicletario_id);

    mutate({
      ra_aluno: ra,
      bicicletario: bicicletario_id
    });    

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
              <Label htmlFor="ra">Codigo cartao: </Label>
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
