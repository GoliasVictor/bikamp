import { useState } from "react";

type Cargo = 1 | 2 | 3 | 4 | undefined;

type Props = {
  onSubmit: ( mantenedor_id: number, nome: string, cargo: Cargo, senha: string ) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function RegistrarMantenedor({ onSubmit, onCancel, loading }: Props) {
  const [mantenedor_id, setId] = useState(0);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState<Cargo | undefined>(undefined);
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cargo) {
      alert("Por favor, selecione um cargo válido.");
      return;
    }
    onSubmit(mantenedor_id, nome, cargo, senha);
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
      <h3>Adicionar Novo Mantenedor</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Id: <br />
          <input
            type="number"
            required
            value={mantenedor_id}
            onChange={ (e) => setId(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Nome: <br />
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
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
            style={{ width: "100%" }}
          >
            <option value="" disabled>
              Selecione um cargo
            </option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Senha: <br />
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: "100%" }}
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
