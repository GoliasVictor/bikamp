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
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PenalidadeService } from '@/lib/services';
import { components } from "@/lib/api/specs";
import { Plus } from "lucide-react";
import EmprestimoCiclistaComboBox from "@/pages/penalidades/emprestimoCiclistaComboBox";
import TipoPenalidadeComboBox from "./penalidadeTipoComboBox";
import { Textarea } from "@/components/ui/textarea";
import CiclistaComboBox from "@/components/ciclistaComboBox";

type NovaPenalidade = components["schemas"]["NovaPenalidadeManual"]

export function PenalidadeNovaDialog() {
  const client = useApi()
  const queryClient = useQueryClient();
  const service = new PenalidadeService(client);
  const [open, setOpen] = useState(false);

  const [mantenedorIdStr, setMantenedorIdStr] = useState("");
  const [ciclista_ra, setCiclistaRa] = useState<number | null>(null);
  const [detalhes, setDetalhes] = useState("");
  const [tipo_penalidade_id, setTipoPenalidadeId] = useState<null | number>(null)
  const [emprestimo_inicio, setEmprestimoInicio] = useState<string | null>(null);
  const [duracaoDias, setDuracaoDias] = useState<"" | number>(0);


  const { mutate } = useMutation({
    mutationFn: (data: NovaPenalidade) => {
      return service.postPenalidade(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mantenedores"] });
      setOpen(false);
    },
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const mantenedorId = parseInt(mantenedorIdStr);
    if (isNaN(mantenedorId)) {
      toast.error("Identificação deve ser um número válido.");
      return;
    }
    if (ciclista_ra === null || ciclista_ra <= 0) {
      toast.error("RA do ciclista deve ser um número válido.");
      return;
    }
    if (emprestimo_inicio === null) {
      toast.error("Selecione um empréstimo válido.");
      return;
    }
    if (tipo_penalidade_id === null) {
      toast.error("Selecione um tipo de penalidade")
      return
    }
    if (duracaoDias === "" || duracaoDias <= 0) {
      toast.error("Duração deve ser um número válido maior que zero.");
      return;
    } 
    const detalhe = detalhes.trim();
    mutate({
      ciclista_ra: ciclista_ra,
      detalhes: detalhes == "" ? null : detalhe,
      tipo_penalidade_id: tipo_penalidade_id,
      emprestimo_inicio: emprestimo_inicio,
      mantenedor_id_aplicador: Number(mantenedorIdStr),
      penalidade_fim: (new Date(Date.now() + duracaoDias * 24 * 60 * 60 * 1000)).toISOString()
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Aplicar penalidade manual
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-sm w-min">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Mantenedor</DialogTitle>
            <DialogDescription>
              Insira os dados do novo mantenedor.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="mantenedor_id">Identificador Mantenador: </Label>
              <Input
                id="mantenedor_id"
                type="number"
                required
                value={mantenedorIdStr}
                onChange={(e) => setMantenedorIdStr(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div className="grid gap-3">
                <Label htmlFor="ciclista_ra">RA do ciclista: </Label>
                <CiclistaComboBox
                  id="ciclista_ra"
                  value={ciclista_ra}
                  onChange={setCiclistaRa}
                />
              </div>
              <div className="grid gap-3 text-left">
                <Label>
                  Hora Emprestimo:
                </Label>
                <EmprestimoCiclistaComboBox value={emprestimo_inicio} onChange={setEmprestimoInicio} ciclista_ra={ciclista_ra} />
              </div>

            </div>

            <div className="grid gap-3 text-left">
              <Label>
                Tipo de penalidade:
              </Label>
              <TipoPenalidadeComboBox value={tipo_penalidade_id} onChange={setTipoPenalidadeId} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="duracao">Duração (dias): </Label>
              <Input
                id="duracao"
                type="number"
                required
                value={duracaoDias}
                onChange={(e) => setDuracaoDias(e.target.value as number | "")}
                className="w-xs"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="detalhes">Detalhes: </Label>
              <Textarea
                id="detalhes"
                placeholder="Descreva a penalidade aplicada..."
                className="resize-none"
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
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
