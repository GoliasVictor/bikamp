import { useEffect, useState } from 'react'
import '../App.css'
import type { components } from "../lib/api/v1";
import { useApi } from '../clientApi';
import { useModal } from '../hooks/useModal';
import RegistrarMantenedor from '../components/registrarMantenedor';
import EditarMantenedor from '../components/editarMantenedor';
import { GetMantenedoresCommand, PatchMantenedoresCommand, PostMantenedoresCommand } from '../commands/concreteCommands';
import { MantenedorService } from '../commands/receivers';
import { DataTable } from '../components/dataTable';
import { Column } from '../components/dataTable';
import { BikampCommand } from '../commands/command';

type Mantenedor = components["schemas"]["Mantenedor"];
type Cargo = 1 | 2 | 3 | 4 | undefined;

export default function MantenedoresPage() {
  const [mantenedores, setMantenedores] = useState<Mantenedor[]>([])
  const [filtro, setFiltro] = useState<string>('')
  const [ordenacao, setOrdenacao] = useState<'id' | 'nome' | 'cargo'>('id')
  const client = useApi()
  const modal = useModal()

  const mantenedorService = new MantenedorService(client);
  const getMantenedoresCommand = new GetMantenedoresCommand(mantenedorService);
  type MantenedorRow = Mantenedor & {
  action: JSX.Element;
};

  const columns: Column<MantenedorRow>[] = [
    {
      header: 'ID',
      accessor: 'mantenedor_id',
      align: 'right',
      width: '10%',
    },
    {
      header: 'Nome',
      accessor: 'nome',
      align: 'left',
      width: '45%',
    },
    {
      header: 'Cargo',
      accessor: 'cargo',
      align: 'left',
      width: '45%',
    },
    {
      header: '',
      accessor: 'action',
      align: 'left',
      width: '45%',
    }
  ];

  const openRegiModal = () => {
    modal.setModal(
      <RegistrarMantenedor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={false}
      />
    );
  }

  const openEditModal = (mantenedor: Mantenedor) => {
  modal.setModal(
    <EditarMantenedor
      mantenedor={mantenedor}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={false}
    />
  );
};


  async function handleSubmit(action: "post" | "patch", mantenedor_id: number, nome: string, cargo: Cargo, senha: string) {
    let command: BikampCommand | undefined;

    if (action === "post") {
      command = new PostMantenedoresCommand(mantenedorService, mantenedor_id, nome, cargo, senha)
    }

    if (action === "patch") {
      command = new PatchMantenedoresCommand(mantenedorService, mantenedor_id, nome, cargo, senha)
    }

    if (command && await command.execute()) {
      modal.closeModal()
    }
  }

  function handleCancel() {
    modal.closeModal()
  }

  useEffect(() => {
    const fetchMantenedores = async () => {
      const commandOutput = await getMantenedoresCommand.execute();
      setMantenedores(commandOutput);
    };

    fetchMantenedores()
  }, [])

  const mantenedoresFiltered = mantenedores
    .filter(m => {
      const termo = filtro.toLowerCase();
      return (
        ("id " + m.mantenedor_id?.toString()).includes(termo) ||
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
  const mantenedoresRow: MantenedorRow[] = mantenedoresFiltered.map(m => ({
  ...m,
  action: (
    <button
      onClick={() => openEditModal(m)}
      style={{
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Editar
    </button>
  )
}));


  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{
        fontSize: '1.75rem', // ou '28px'
        fontWeight: 'bold',
        color: '#007BFF', // azul forte
        marginBottom: '1rem',
        borderBottom: '2px solid #007BFF',
        paddingBottom: '0.5rem'
      }}>Lista de Mantenedores</h2>

      <div>
        <input
          type="text"
          placeholder=" Filtro da pesquisa"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            marginRight: '1rem',
            border: '2px solid #007BFF',
            borderRadius: '4px',
            padding: '0.5rem',
            fontSize: '1rem',
            height: '2.5rem',
            boxSizing: 'border-box'
          }}

        />

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as 'id' | 'nome' | 'cargo')}
          style={{
            marginRight: '1rem',
            border: '2px solid #007BFF',
            borderRadius: '4px',
            padding: '0.5rem',
            fontSize: '1rem',
            height: '2.5rem',
            boxSizing: 'border-box'
          }}
        >
          <option value="id">Ordenar por ID</option>
          <option value="nome">Ordenar por Nome</option>
          <option value="cargo">Ordenar por Cargo</option>
        </select>
        <button type="submit" onClick={openRegiModal}
          style={{
            marginRight: '1rem',
            color: '#fff',
            border: '2px solid #007BFF',
            backgroundColor: " #007BFF",
            borderRadius: '4px',
            padding: '0.5rem',
            fontSize: '1rem',
            textAlign: "center",
            height: '2.5rem',
            boxSizing: 'border-box',
            marginTop: 'rem',
            cursor: 'pointer'
          }}>Novo Mantenedor</button>
      </div>
      <DataTable<MantenedorRow> columns={columns} data={mantenedoresRow} />
    </div>
  );
}

