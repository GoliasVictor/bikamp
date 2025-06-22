import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/lastest";
import { useApi } from '../clientApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useModal } from '../hooks/useModal';
import RegistrarMantenedor from '../components/registrarMantenedor';
import { MantenedorService } from '../services/services';

type Mantenedor = components["schemas"]["Mantenedor"];

export default function MantenedoresPage() { 
  const [filtro, setFiltro] = useState<string>('')
  const [ordenacao, setOrdenacao] = useState<'id' | 'nome' | 'cargo'>('id')
  const api = useApi()
  const modal = useModal()
  const mantenedorService = new MantenedorService(api);
  const queryClient = useQueryClient();

  const { data : mantenedores, isLoading, error } = useQuery({
    queryKey: ["mantenedores"], 
    queryFn: async () => await mantenedorService.getMantenedores()
  })
  
  const { mutate } = useMutation({
    mutationFn: (data: Mantenedor) => {
      return mantenedorService.postMantenedores(data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["mantenedores"] });
      modal.closeModal()
    },
  });
  
  const openModal = () => {
    modal.setModal(
      <RegistrarMantenedor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={false}
      />
    );
  }


  async function handleSubmit(data : Mantenedor) {
    mutate(data)
  }

  function handleCancel() {
    modal.closeModal()
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.name}</div>
  }

  const mantenedoresFiltrados = mantenedores!
    .filter(m => {
      const termo = filtro.toLowerCase();
      return (
        m.mantenedor_id?.toString().includes(termo) ||
        m.nome?.toLowerCase().includes(termo) ||
        ("cargo " + m.cargo?.toString()).includes(termo)
      );
    })
    .sort((a, b) => {
      if (ordenacao === 'id') {
        return (a.mantenedor_id ?? 0) - (b.mantenedor_id ?? 0);
      } else if (ordenacao === 'cargo') {
        return (a.cargo ?? 0) - (b.cargo ?? 0);
      } else {
        const campoA = (a.nome ?? '').toString().toLowerCase();
        const campoB = (b.nome ?? '').toString().toLowerCase();
        return campoA.localeCompare(campoB);
      }
    });

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Lista de Mantenedores</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder=" Filtro da pesquisa"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginRight: '1rem' }}
        />

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as 'id' | 'nome' | 'cargo')}
        >
          <option value="id">Ordenar por ID</option>
          <option value="nome">Ordenar por Nome</option>
          <option value="cargo">Ordenar por Cargo</option>
        </select>
        <button type="submit" onClick={openModal}>Novo Mantenedor</button>
      </div>

      {mantenedoresFiltrados.map((t) =>
        <p key={t.mantenedor_id?.toString()!}>
          {t.mantenedor_id} - {t.nome} - Cargo {t.cargo}
        </p>
      )}
    </div>
  );
}

