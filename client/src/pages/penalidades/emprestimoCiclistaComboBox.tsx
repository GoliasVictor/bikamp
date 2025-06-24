import { useApi } from "@/hooks/useApi";
import { EmprestimosService } from "@/lib/services";
import { ComboBox } from "@/components/ui/combo-box";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";

export default function EmprestimoCiclistaComboBox(props: {
  value: string | null,
  onChange: (emprestimo_inicio: string | null) => void,
  ciclista_ra: number | null
}) {
  const client = useApi();
  const value = props.value || ""
  const emprestimoService = new EmprestimosService(client);
  const { data: emprestimos, error, isLoading } = useQuery({
    queryKey: ["emprestimos"],
    queryFn: async () => {
      return emprestimoService.getEmprestimos();
    },
  });
  function handleChange(emprestimo_inicio: string) {
    if (emprestimo_inicio.trim() == "")
      return props.onChange(null);
    props.onChange(emprestimo_inicio);
  }
  console.log(value)
  const dateEmprestimos = isLoading ? [] : emprestimos?.filter(e => e.ciclista_ra == props.ciclista_ra).map(e => e.emprestimo_inicio) || []; 
  return (<ComboBox
    value={value}
    valueToView={(v) => new Date(v).toLocaleString("br")}
    onChange={handleChange}
    values={dateEmprestimos}
    disabled={dateEmprestimos.length == 0}
    placeholder="Selecione um empréstimo"
  />)
} 