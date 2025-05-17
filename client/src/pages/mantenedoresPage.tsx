import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/v1";
import { useApi } from '../clientApi';
import { useModal } from '../hooks/useModal';
import RegistrarMantenedor from '../components/registrarMantenedor';

type Mantenedor = components["schemas"]["Mantenedor"];
type Cargo = 1 | 2 | 3 | 4 | undefined;

export default function MantenedoresPage() {
  const [mantenedores, setMantenedores] = useState<Mantenedor[]>([])
  const [filtro, setFiltro] = useState<string>('')
  const [ordenacao, setOrdenacao] = useState<'id' | 'nome' | 'cargo'>('id')
  const client = useApi()
  const modal = useModal()

  const openModal = () => {
    modal.setModal(
      <RegistrarMantenedor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={false}
      />
    );
  }


  async function handleSubmit(data: { mantenedor_id: number, nome: string; cargo: Cargo; senha: string }) {
    console.log("mantenedores:" + mantenedores)

    if (mantenedores.some(m => m.mantenedor_id === data.mantenedor_id)) {
      alert("Este ID já esta em uso.")

    } else {
      try {
        const request = await client.POST("/mantenedores", {
          body: data
        });
        
        if (request.response.ok){
          alert("Mantenedor criado com sucesso!");
          modal.closeModal();
        } else {
          throw new Error(`${request.response.status} ${request.response.statusText}`);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        alert("Erro inesperado" + (err instanceof Error ? ": " + err.message : "."));
      }
    }
  }

  function handleCancel() {
    modal.closeModal();
  }

  useEffect(() => {

    client.GET("/mantenedores").then(res => {

      if (res.data != null) {
        setMantenedores(res.data);
      }

    });

  }, [])

  const mantenedoresFiltrados = mantenedores
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

