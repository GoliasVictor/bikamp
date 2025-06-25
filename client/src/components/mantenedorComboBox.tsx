import { useApi } from "@/hooks/useApi";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function MantenedorComboBox(props: {
  value: number | null,
  onChange: (value: number | null) => void,
  id?: string
}) {
  const client = useApi();
  const value = props.value?.toString() || ""
  const { data } = useQuery({
    queryKey: ["mantenedores"],
    queryFn: async () => {
      return (await client.GET("/mantenedores")).data
    },
  });
  function handleChange(idStr: string) {
    if (idStr.trim() == "")
      return props.onChange(null);
    props.onChange(Number(idStr));
  }
  
  const ids = data?.map(e => e.mantenedor_id.toString()) || [];
  
  return (<ComboBox
    value={value}
    valueToView={(v) => data?.find(t => t.mantenedor_id == Number(v))?.nome || "" }
    onChange={handleChange}
    values={ids}
    disabled={ids.length == 0}
    placeholder="Selecione um mantenedor"
    id={props.id}
  />)
} 