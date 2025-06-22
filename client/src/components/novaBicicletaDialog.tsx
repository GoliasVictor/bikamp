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
import { BicicletaService } from '../lib/services';
import { StatusBicicleta, StatusBicicletaEnum } from "@/lib/statusBicicleta";
import { components } from "@/lib/api/specs";


export function NovaBicicletaDialog() {
  const client = useApi()
  const queryClient = useQueryClient();
  const bicicletaService = new BicicletaService(client);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<StatusBicicletaEnum>(StatusBicicletaEnum.Ativada);
  const [bicicleta_patrimonio, setPatrimonio] = useState("");
  const { mutate }  = useMutation({
    mutationFn: (data: components["schemas"]["PostBicicleta"]) => {
      return bicicletaService.postBicicleta(data);
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["bicicletas"] });
      toast("Editado a bicicleta com sucesso!",
        {        
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
      status: status,
      bicicleta_patrimonio: bicicleta_patrimonio
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Bicicleta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-sm ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Bicicleta</DialogTitle>
            <DialogDescription>
              Indique os novos valores para a bicicleta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">

            <div className="grid gap-3">
              <Label htmlFor="bicicletario">Status: </Label>
 <Select onValueChange={
          (str) => setStatus(Number(str))}
          defaultValue={status.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
          <SelectContent>
            {
                    StatusBicicleta.allStatuses().filter(([cd, _]) => {
                      return [StatusBicicletaEnum.Ativada, StatusBicicletaEnum.Manutencao, StatusBicicletaEnum.Desativada].includes(cd);
                    }).map(([cd, str]) => (
                <SelectItem key={cd} value={cd.toString()}>
                  {str}
                </SelectItem>
              ))
              }
            </SelectContent>
          </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="ponto_id">Identificação Patrimônio: </Label> 
              <Input
                id="ponto_id"
                type="text"
                required
                value={bicicleta_patrimonio}
                onChange={(e) => setPatrimonio(e.target.value)}
                className="w-xs"
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
