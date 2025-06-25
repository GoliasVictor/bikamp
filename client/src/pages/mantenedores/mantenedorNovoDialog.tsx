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
import { MantenedorService } from '../../lib/services';
import cargos from "@/lib/cargos";
import {CargoEnum} from "@/lib/cargos";
import { components } from "@/lib/api/specs";


export function MantenedorNovoDialog() {
  const client = useApi()
  const queryClient = useQueryClient();
  const mantenedorService = new MantenedorService(client);
  const [open, setOpen] = useState(false);

  const [cargo, setCargo] = useState<CargoEnum>(CargoEnum.Supervisor);
  const [mantenedorIdStr, setMantenedorIdStr] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
 

  const { mutate } = useMutation({
    mutationFn: (data: components["schemas"]["Mantenedor"]) => {
      return mantenedorService.postMantenedores(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mantenedores"] });
      setOpen(false);
    },
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mantenedorIdStr === "" || nome === "" || senha === "") {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    const mantenedorId = parseInt(mantenedorIdStr);
    if (isNaN(mantenedorId)) {
      toast.error("Identificação deve ser um número válido.");
      return;
    }
    mutate({
      cargo: cargo,
      mantenedor_id: mantenedorId,
      nome: nome,
      senha: senha 
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Novo Mantenedor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-sm w-min">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Mantenedor</DialogTitle>
            <DialogDescription>
              Insira os dados do novo mantenedor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="mantenedor_id">Identificacao: </Label> 
              <Input
                id="mantenedor_id"
                type="number"
                required
                value={mantenedorIdStr}
                onChange={(e) => setMantenedorIdStr(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="senha">Senha: </Label>
              <Input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="nome">Nome: </Label>
              <Input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bicicletario">Cargo: </Label>
 <Select onValueChange={
          (str) => setCargo(Number(str))}
          defaultValue={cargo.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
          <SelectContent>
            {
                  cargos.allCargos().filter(([cd, _]) => {
                      return [CargoEnum.Administrador, CargoEnum.Reparador, CargoEnum.Supervisor].includes(cd);
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
