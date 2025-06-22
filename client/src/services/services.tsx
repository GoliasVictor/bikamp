import { useApi } from "../clientApi";
import type { components } from "../lib/api/lastest";
type Cargo = components["schemas"]["Mantenedor"]["cargo"];

type RequestDevolucao = components["schemas"]["RequestDevolucao"];
//TODO: classes que para cada tipo de dado executam suas requisições   
export class MantenedorService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }
  async getMantenedores(): Promise<components["schemas"]["Mantenedor"][]> {
    const request = await this.client.GET("/mantenedores");
    return request.data ?? [];
  }

  async postMantenedores(data: { mantenedor_id: number, nome: string; cargo: Cargo; senha: string }): Promise<any> {
    console.log(data)
    const request = await this.client.POST("/mantenedores", { body: data });
    return request.response ?? []
  }
}

export class EmprestimosService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }
  async getEmprestimos(): Promise<components["schemas"]["Emprestimo"][]> {
    const request = await this.client.GET("/emprestimos");
    return request.data ?? [];
  }
}

export class BicicletaService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }

  async getBicicletas(): Promise<components["schemas"]["BicicletaPonto"][]> {
    return (await this.client.GET("/bicicletas")).data ?? []  
  }
  async putBicicleta(data: components["schemas"]["Bicicleta"]): Promise<any> {
    return this.client.PUT(`/bicicletas`, { body: data });
  }
  async postBicicleta(data: components["schemas"]["PostBicicleta"]): Promise<any> {
    const request = await this.client.POST(`/bicicletas`, { body: data });
    return request.data;
  }
}

export class SimuladorService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }

  async postInteracaoRa(data: { bicicletario: number, ra_aluno: number }): Promise<any> {
    const request = await this.client.POST("/api-bicicletario/emprestimos", { body: data });
    return request.data;
  }

  async patchDevolverBicicleta(data: RequestDevolucao): Promise<any> {
    const request = await this.client.PATCH("/api-bicicletario/ponto/bicicleta", { body: data });
    return request.data;
  }
}