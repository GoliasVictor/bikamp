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
import statusPonto, { StatusPontoEnum } from "@/lib/statusPonto";
import { components } from "@/lib/api/specs";

type NovoBicicletario = components["schemas"]["RequestCreateBicicletario"]

export function BicicletarioNovoDialog() {
  const client = useApi()
  const queryClient = useQueryClient();
  const bicicletarioService = new BicicletariosService(client);
  const [open, setOpen] = useState(false);
  const [longitude, setLongitude] = useState<number | "">(0);
  const [latitude, setLatitude] = useState<number | "">(0);

  const { mutate } = useMutation({
    mutationFn: async (data: NovoBicicletario) => {
      await bicicletarioService.postBicicletario(data);
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
    if (longitude == "" || latitude == "") {
      toast.error("Coordenadas devem ser números válidos.");
      return;
    }
    mutate({
      longitude: longitude,
      latitude: latitude,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Bicicletario</Button>
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
              <Label htmlFor="mantenedor_id">Latidude: </Label>
              <Input
                id="mantenedor_id"
                type="number"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value as number | "")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="mantenedor_id">Longitude: </Label>
              <Input
                id="mantenedor_id"
                type="number"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value as number | "")}
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
