import { BikampCommand } from "./command";
import type { components } from "../lib/api/v1";

//TODO: importar recievers 
import { BicicletaService, EmprestimosService, MantenedorService } from "./receivers";

type Mantenedor = components["schemas"]["Mantenedor"];
type Cargo = components["schemas"]["Mantenedor"]["cargo"];
type Emprestimo = components["schemas"]["Emprestimo"]; 
type Bicicleta = components["schemas"]["Bicicleta"]; 

//TODO: classes que implementam BikampCommand

export class GetMantenedoresCommand implements BikampCommand {
    constructor(
        private mantenedorService: MantenedorService
    ) { }
    async execute(): Promise<Mantenedor[]> {
        return await this.mantenedorService.getMantenedores()
    }
}

export class PostMantenedoresCommand implements BikampCommand {
    private data: {
        mantenedor_id: number;
        nome: string;
        cargo: Cargo;
        senha: string;
    };

    constructor(
        private mantenedorService: MantenedorService,
        mantenedor_id: number,
        nome: string,
        cargo: Cargo,
        senha: string
    ) {
        this.data = { mantenedor_id, nome, cargo, senha };
    }

    async execute(): Promise<boolean> {

        const mantenedores: Mantenedor[] = await this.mantenedorService.getMantenedores();

        if (mantenedores.some(m => m.mantenedor_id === this.data.mantenedor_id)) {
            alert("Este ID já está em uso.") 
            throw new Error("Este ID já está em uso.");

        } else {
            try {
                const response = await this.mantenedorService.postMantenedores(this.data);

                if (response.ok) {
                    alert("Mantenedor criado com sucesso!")
                    return true;
                } else {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
                alert("Erro inesperado" + (err instanceof Error ? ": " + err.message : "."));
                return false;
            }
        }
    }

   
  }

export class GetEmprestimosCommand implements BikampCommand {
    constructor(
        private emprestimoService : EmprestimosService
    ) { }
    
    async execute(): Promise<Emprestimo[]> {
        return await this.emprestimoService.getEmprestimos() 
    }
}

export class GetBicicletasCommand implements BikampCommand {
    constructor(
        private bicicletasService : BicicletaService 
    ) { }

    async execute(): Promise<Bicicleta[]> {
        return await this.bicicletasService.getBicicletas()
    }
}