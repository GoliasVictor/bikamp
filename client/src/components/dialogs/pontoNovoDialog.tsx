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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BicicletariosService } from '../../lib/services';
import { components } from "@/lib/api/specs";
import statusPonto, { StatusPontoEnum } from "@/lib/statusPonto";

type NovoPonto = components["schemas"]["NovoPonto"]

export function PontoNovoDialog(props : { bicicletario_id: number}) {
  const client = useApi()
  const queryClient = useQueryClient();
  const bicicletarioService = new BicicletariosService(client);
  const [open, setOpen] = useState(false);
  
  const [status, setStatus] = useState(StatusPontoEnum.Online);
  const [id, setId] = useState<number | "">(0);
    console.log("open", open)
  

  const { mutate } = useMutation({
    mutationFn: async (data: NovoPonto) => {
      return bicicletarioService.postPontoBicicletario(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bicicletarios"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Erro ao adicionar ponto: " + error.message);
    }
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id == "") {
      toast.error("Identificação deve ser um número válido.");
      return;
    }
    mutate({
      bicicletario_id: props.bicicletario_id,
      ponto_id: id,
      status_ponto_id: status
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Ponto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-sm w-min">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Ponto</DialogTitle>
            <DialogDescription>
              Insira as informacoes do ponto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="mantenedor_id">Identificacao: </Label> 
              <Input
                id="mantenedor_id"
                type="number"
                required
                value={id}
                onChange={(e) => setId(e.target.value as number | "")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bicicletario">Cargo: </Label>
 <Select onValueChange={
          (str) => setStatus(Number(str))}
          defaultValue={status.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
          <SelectContent>
            {
                  statusPonto.all().filter(([cd, _]) => {
                      return [StatusPontoEnum.Online, StatusPontoEnum.Offline, StatusPontoEnum.Manutencao].includes(cd);
                    }).map(([cd, str]) => (
                <SelectItem key={cd} value={cd.toString()}>
                  {str}
                </SelectItem>
              ))
              }
            </SelectContent>
          </Select>
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
