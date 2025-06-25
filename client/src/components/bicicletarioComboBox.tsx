import { useApi } from "@/hooks/useApi";
import { BicicletariosService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function BicicletarioComboBox(props: {
  value: number | null,
  onChange: (emprestimo_inicio: number | null) => void,
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
  
  const idsTipos = data?.map(e => e.id.toString()) || [];
  
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