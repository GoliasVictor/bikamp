import { useState } from "react";

type Cargo = 1 | 2 | 3 | 4 | undefined;

type Props = {
  onSubmit: ( ra: number, bicicletario: number ) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function EncostarRaModal({ onSubmit, onCancel, loading }: Props) {
  const [ra, setRA] = useState<number | undefined>(undefined);
  const [bicicletario_id, setBicicletarioID] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ra == null || ra == undefined) {
      alert("Por favor, insira um RA válido.");
      return;
    }
    onSubmit(ra, bicicletario_id);
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
      <h3>Simulação de interação de RA com bicicletário</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          RA: <br />
          <input
            type="number"
            required
            value={ra}
            onChange={ (e) => setRA(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Bicicletário: <br />
          <input
            type="number"
            required
            value={bicicletario_id}
            onChange={ (e) => setBicicletarioID(Number(e.target.value))}
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
