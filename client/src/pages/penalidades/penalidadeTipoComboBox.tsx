import { useApi } from "@/hooks/useApi";
import { TipoPenalidadeService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function TipoPenalidadeComboBox(props: {
  value: number | null,
  onChange: (emprestimo_inicio: number | null) => void,
}) {
  const client = useApi();
  const value = props.value?.toString() || ""
  const service = new TipoPenalidadeService(client);
  const { data: tipos } = useQuery({
    queryKey: ["tipos-penalidade"],
    queryFn: async () => {
      return service.getTiposPenalidade();
    },
  });
  function handleChange(idStr: string) {
    if (idStr.trim() == "")
      return props.onChange(null);
    props.onChange(Number(idStr));
  }
  
  const idsTipos = tipos?.map(e  => e.tipo_penalidade_id.toString()) || []; 
  
  return (<ComboBox
    value={value}
    valueToView={(v) => tipos?.find(t => t.tipo_penalidade_id == Number(v))?.nome || ""}
    onChange={handleChange}
    values={idsTipos}
    disabled={idsTipos.length == 0}
    placeholder="Selecione um tipo de penalidade"
  />)
} 