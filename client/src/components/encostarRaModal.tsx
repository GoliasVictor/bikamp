import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <form onSubmit={handleSubmit}>
      <Card className="w-100">
      <CardHeader>
       <CardTitle>Simulação de interação de RA com bicicletário</CardTitle>
        <CardDescription>
          Inisira o ra e o bicicletario que sera feito a interação.
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div style={{ marginBottom: "1rem" }} className="flex flex-col gap-6">
          <div className="grid gap-2">          
            <Label htmlFor="ra">RA: </Label>
            <Input
              id="ra"
              type="number"
              required
              value={ra}
              onChange={ (e) => setRA(Number(e.target.value))}
              style={{ width: "100%" }}
            />  
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bicicletario">Bicicletário: </Label>
            <Input
              id="bicicletario"
              type="number"
              required
              value={bicicletario_id}
              onChange={ (e) => setBicicletarioID(Number(e.target.value))}
              style={{ width: "100%" }}
              />
          </div>
            
          </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-full">
          Cancelar
        </Button>
      </CardFooter>  
      
      </Card>
    </form>
  );
}
