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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BicicletariosService } from '../../lib/services';
import { components } from "@/lib/api/specs";
import statusPonto, { StatusPontoEnum } from "@/lib/statusPonto";
import { Edit } from "lucide-react";

type AtualizacaoPonto = components["schemas"]["AtualizacaoPonto"]

export function PontoEditarDialog(props: {
  defaultValue: {
    bicicletario_id: number,
    ponto_id: number,
    status: StatusPontoEnum
  }}) {
  const client = useApi()
  const queryClient = useQueryClient();
  const bicicletarioService = new BicicletariosService(client);
  const [open, setOpen] = useState(false);
  
  const [status, setStatus] = useState(props.defaultValue.status);
  

  const { mutate } = useMutation({
    mutationFn: async (data: AtualizacaoPonto) => {
      return bicicletarioService.patchPontoBicicletario(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bicicletarios"] });
      setOpen(false);
    },
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({
      bicicletario_id: props.defaultValue.bicicletario_id,
      ponto_id: props.defaultValue.ponto_id,
      status: status
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Editar Ponto</span>
            <Edit />
          </Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-sm w-min">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar ponto</DialogTitle>
            <DialogDescription>
              Insira os novos dados do ponto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 my-4">
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
