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
import type { components } from "../lib/api/lastest";
import { toast } from 'sonner';
import { useApi } from '../clientApi';
import { PatchDevolverBicicletaCommand, PutBicicletasCommand } from '../commands/concreteCommands';
import { BicicletaService, SimuladorService } from '../commands/receivers';
import { useModal } from '../hooks/useModal';
import { json } from "stream/consumers";
import { Edit } from "lucide-react";
import { StatusBicicleta } from "@/lib/statusBicicleta";

type Props = {
  bicicletaId: number;
  defaultValue: { status: number, bicicleta_patrimonio: string };
  onUpdated: () => void;
};

export function EditarBicicletaDialog(props: Props) {
  const client = useApi()
  const bicicletaService = new BicicletaService(client);
  const [open, setOpen] = useState(false);
  console.log("d", props)  
  let {bicicletaId, defaultValue: defaultValue, onUpdated } = props
  const [status, setStatus] = useState<number>(defaultValue.status);
  const [bicicleta_patrimonio, setPatrimonio] = useState(defaultValue.bicicleta_patrimonio);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
     

    const command = new PutBicicletasCommand(bicicletaService, bicicletaId, status, bicicleta_patrimonio);

    const result = await command.execute()
    setOpen(false);
    toast("Editado a bicicleta com sucesso!",
      {        
        action: {
          label: "Ok", onClick: () => console.log("Ok"),
        },
        duration: 2000,
      })
    onUpdated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Editar bicicleta</span>
            <Edit />
          </Button> 
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
              StatusBicicleta.allStatuses().map(([cd, str]) => (
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
