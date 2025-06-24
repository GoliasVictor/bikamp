import { useApi } from "../hooks/useApi";
import type { components } from "./api/specs";
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

export class BicicletariosService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }

  async getBicicletarios(): Promise<components["schemas"]["Bicicletario"][]> {
    return (await this.client.GET("/bicicletarios", {
      params: {
        query: {
          detalhado: true
        }
      }
    })).data ?? []  
  }
  async deleteBicicletario(id: number): Promise<any> {
    const request = await this.client.DELETE(`/bicicletarios/{id}`, {
      params: {
        path: {
          id: id
        }
      }
    });
    if (request.error) {
      throw Error((request as any).error) 
    }
  }
  async postBicicletario(data: components["schemas"]["RequestCreateBicicletario"]): Promise<number> {
    const request = await this.client.POST(`/bicicletarios`, { body: data });
    if (request.data == undefined) {
      return -1
    }
    return request.data;
  }

  async postPontoBicicletario(data: components["schemas"]["NovoPonto"]): Promise<any> {
    const request = await this.client.POST(`/pontos`, { body: data });
    if (request.error) {
      throw Error((request as any).error) 
    }
  }

  async patchPontoBicicletario(data: components["schemas"]["AtualizacaoPonto"]): Promise<any> {
    const request = await this.client.PATCH(`/pontos`, { body: data });
    if (request.error) {
      throw Error((request as any).error) 
    }
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

export class PenalidadeService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }

  async getPenalidades(): Promise<components["schemas"]["Penalidade"][]> {
    return (await this.client.GET("/penalidades")).data ?? []  
  }
  async putPenalidade(data: components["schemas"]["RequestPerdoarPenalidade"]): Promise<any> {
    return this.client.PATCH(`/penalidades`, { body: data });
  }
  async postPenalidade(data: components["schemas"]["NovaPenalidadeManual"]): Promise<any> {
    const request = await this.client.POST(`/penalidades/manual`, { body: data });
    return request.data;
  }
}

export class TipoPenalidadeService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }

  async getTiposPenalidade(): Promise<components["schemas"]["TipoPenalidade"][]> {
    return (await this.client.GET("/tipo-penalidade")).data ?? []
  }
}