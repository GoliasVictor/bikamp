import { useEffect, useState } from "react";
import type { components } from "../lib/api/v1";
type Mantenedor = components["schemas"]["Mantenedor"];
type Cargo = 1 | 2 | 3 | 4 | undefined;

type Props = {
  mantenedor: Mantenedor;
  onSubmit: (action: "patch", mantenedor_id: number, nome: string, cargo: Cargo, senha: string) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function EditarMantenedor({ mantenedor: preData, onSubmit, onCancel, loading }: Props) {

  const [mantenedor_id, setId] = useState(0);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState<Cargo | undefined>(undefined);
  const [senha, setSenha] = useState("");

  useEffect(() => {
    setId(preData.mantenedor_id ?? 0);
    setNome(preData.nome ?? "");
    setCargo(preData.cargo);
  }, [preData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cargo) {
      alert("Por favor, selecione um cargo válido.");
      return;
    }
    onSubmit("patch", mantenedor_id, nome, cargo, senha);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "black",
        padding: "2rem",
        borderRadius: "8px",
        minWidth: "320px",
      }}
    >
      <h3 style={{
        fontSize: '1.75rem', // ou '28px'
        fontWeight: 'bold',
        color: '#007BFF', // azul forte
        marginBottom: '1rem',
        borderBottom: '2px solid #007BFF',
        paddingBottom: '0.5rem'
      }}>Adicionar Novo Mantenedor</h3>

      <div style={{ fontWeight: 'bold', marginBottom: "1rem", textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>
          Id: <br />
          <input
            type="number"
            value={mantenedor_id}
            readOnly
            disabled
            style={{
              width: "100%",
              fontWeight: "100",
              backgroundColor: "#f5f5f5",
              color: "#6c757d",
              border: "1px solid #ced4da",
              cursor: "not-allowed"
            }}
          />
        </label>
        <label>
          Nome: <br />
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: "100%", fontWeight: "100" }}
          />
        </label>
        <label>
          Cargo: <br />
          <select
            required
            value={cargo ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              if ([1, 2, 3, 4].includes(value)) {
                setCargo(value as Cargo);
              } else {
                setCargo(undefined);
              }
            }}
            style={{ width: "100%", fontWeight: "100" }}
          >
            <option value="" disabled >
              Selecione um cargo
            </option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>

        <label>
          Senha: <br />
          <input
            type="password"
            required
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: "100%", fontWeight: "100" }}
          />
        </label>
      </div>

      <button type="submit" disabled={loading} style={{ marginRight: "1rem" }}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
      <button type="button" onClick={onCancel} disabled={loading}>
        Cancelar
      </button>
    </form>
  );
}
