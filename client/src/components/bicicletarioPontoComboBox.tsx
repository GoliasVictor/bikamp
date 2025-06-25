import { useApi } from "@/hooks/useApi";
import { BicicletariosService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function BicicletarioPontoComboBox(props: {
  value: number | null,
  onChange: (emprestimo_inicio: number | null) => void,
  bicicletarioId: number | null,
  id?: string
}) {
  const client = useApi();
  const value = props.value?.toString() || ""
  const service = new BicicletariosService(client);
  const { data } = useQuery({
    queryKey: ["bicicletarios"],
    queryFn: async () => {
      return service.getBicicletarios();
    },
  });
  function handleChange(idStr: string) {
    if (idStr.trim() == "")
      return props.onChange(null);
    props.onChange(Number(idStr));
  }
  let idsTipos : string[] = [];
  const bicicletario = data?.find(b => b.id == props.bicicletarioId)

  if (bicicletario?.pontos) {
    idsTipos = bicicletario.pontos.map(e => e.ponto.toString()) || [];
  }
  
  return (<ComboBox
    value={value}
    valueToView={(v) => data?.find(t => t.id == Number(v))?.id.toString() || ""}
    onChange={handleChange}
    values={idsTipos}
    disabled={idsTipos.length == 0}
    placeholder="Selecione um bicicletário"
    id={props.id}
  />)
} 