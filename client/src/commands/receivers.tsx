import { useApi } from "../clientApi";
import type { components } from "../lib/api/lastest";
type Cargo = components["schemas"]["Mantenedor"]["cargo"];

//TODO: classes que para cada tipo de dado executam suas requisições   
export class MantenedorService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }
   async getMantenedores(): Promise<any> {
    const request = await this.client.GET("/mantenedores");
    return request.data ?? [];
  }

  async postMantenedores(data: { mantenedor_id: number, nome: string; cargo: Cargo; senha: string }): Promise<any> {
    console.log(data)
    const request = await this.client.POST("/mantenedores", {body: data});
    return request.response ?? []
  }
}

export class EmprestimosService {
    private client: ReturnType<typeof useApi>

    constructor(client: ReturnType<typeof useApi>) {
    this.client = client;
  }
   async getEmprestimos(): Promise<any> {
    const request = await this.client.GET("/emprestimos");
    return request.data ?? [];
  }
}

export class BicicletaService {
    private client: ReturnType<typeof useApi>

    constructor(client: ReturnType<typeof useApi>) {
        this.client = client; 
    }

    async getBicicletas(): Promise<any>{
        const request = await this.client.GET("/bicicletas")
        return request.data ?? []
    }
}

export class SimuladorService {
  private client: ReturnType<typeof useApi>

  constructor(client: ReturnType<typeof useApi>) {
      this.client = client; 
  }

  async postIteracaoRa(data : {  bicicletario: number, ra_aluno: number} ): Promise<any>{
    console.log(data)
    const request = await this.client.POST("/api-bicicletario/emprestimos", {body: data});
    return request.response ?? []
  }
}