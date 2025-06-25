import { useApi } from "@/hooks/useApi";
import {  BicicletaService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function BicicletaComboBox(props: {
  value: number | null,
  onChange: (value: number | null) => void,
  id?: string
}) {
  const client = useApi();
  const value = props.value?.toString() || ""
  const service = new BicicletaService(client);
  const { data } = useQuery({
    queryKey: ["bicicletas"],
    queryFn: async () => {
      return service.getBicicletas();
    },
  });
  function handleChange(idStr: string) {
    if (idStr.trim() == "")
      return props.onChange(null);
    props.onChange(Number(idStr));
  }
  
  const ids = data?.map(e => e.id.toString()) || [];
  
  return (<ComboBox
    value={value}
    valueToView={(v) => {
      const object = data?.find(t => t.id == Number(v))
      if (!object) return "";
      return `${object.id}: ${object.bicicleta_patrimonio}`;
    }}
    onChange={handleChange}
    values={ids}
    disabled={ids.length == 0}
    placeholder="Selecione uma bicicleta"
    id={props.id}
  />)
} 