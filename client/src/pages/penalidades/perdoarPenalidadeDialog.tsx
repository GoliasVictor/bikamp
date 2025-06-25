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
  
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi'; 
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PenalidadeService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  penalidadeId: number;
};

export function PerdoarPenalidadeDialog(props: Props) {
  const [open, setOpen] = useState(false);
  const [motivacaoPerdao, setMotivacaoPerdao] = useState<string>("");
  const queryClient = useQueryClient();
  const api = useApi()
  const { user } = useAuth()!;
  const service = new PenalidadeService(api);
  
  const { mutate } = useMutation({
    mutationFn: ( motivacao: string ) => {
      return service.perdoarPenalidade({
        penalidade_id: props.penalidadeId,
        motivacao_perdao: motivacao,
        mantenedor_id_perdoador:  user?.mantenedor_id!
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penalidades"] });
    },
  })
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(motivacaoPerdao)
    setOpen(false);
    toast("Editado a bicicleta com sucesso!",
      {        
        action: {
          label: "Ok", onClick: () => console.log("Ok"),
        },
        duration: 2000,
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="ghost" className="w-full inline" >
            Perdoar
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-sm ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Perdoar Penalidade</DialogTitle>
            <DialogDescription>
              Ao perdoar a penalidade ela sera fechada antecipadamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="motivacao_perdao">Motivacao do perdao: </Label> 
              <Textarea
                value={motivacaoPerdao}
                onChange={(e) => setMotivacaoPerdao(e.target.value)}
                id="motivacao_perdao"
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
