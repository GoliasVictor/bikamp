import { useApi } from "@/hooks/useApi";
import {  BicicletaService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useQuery } from '@tanstack/react-query';

export default function CiclistaComboBox(props: {
  value: number | null,
  onChange: (value: number | null) => void,
  id?: string
}) {
  const client = useApi();
  const value = props.value?.toString() || ""
  const { data } = useQuery({
    queryKey: ["ciclistas"],
    queryFn: async () => {
      return (await client.GET("/ciclistas")).data
    },
  });
  function handleChange(idStr: string) {
    if (idStr.trim() == "")
      return props.onChange(null);
    props.onChange(Number(idStr));
  }
  
  const ids = data?.map(e => e.ciclista_ra.toString()) || [];
  
  return (<ComboBox
    value={value}
    valueToView={(v) => v}
    onChange={handleChange}
    values={ids}
    disabled={ids.length == 0}
    placeholder="Selecione um ciclista"
    id={props.id}
  />)
} 