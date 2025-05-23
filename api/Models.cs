namespace Bikamp;
public enum CargoId {
    Supervisor = 1, 
    Reparador = 2,
    Administrador = 3, 
    Demitido = 4
}

public enum StatusPontoId {
	Online = 1,
	Offline = 2,
	Manutencao = 3,
	Removido = 4
}

public enum StatusBicicletaId {
    Ativada = 1,
	Desativada = 2,
	Manutencao = 3,
	Perdida = 4,
	Removida = 5
}

public record Mantenedor(int mantenedor_id, CargoId cargo, string nome, string senha);
public record Bicicleta(uint id, StatusBicicletaId status);
public record Ciclista(int ciclista_ra);
public record BicicletaPonto(int id, StatusBicicletaId status, int? bicicletario, int? ponto);
public record Emprestimo(
    int ciclista_ra,
    DateTime emprestimo_inicio,
    DateTime? emprestimo_fim,
    int? bicicletario_id_devolvido ,
    int bicicletario_id_tirado,
    int bicicleta_id
);

public record PardonRequest (int ciclista_ra, DateTime pardon_inicio, string justificativa);