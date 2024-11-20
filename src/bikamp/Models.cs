public enum Cargo {
    Supervisor = 1, 
    Reparador = 2,
    Administrador = 3, 
    Demitido = 4
}

public record Mantenedor(int mantenedor_id, Cargo cargo, string nome);
public record Bicicleta(int id, string status);
public record BicicletaPonto(int id, string status, int? bicicletario, int? ponto);
public record Emprestimo(
    int ciclista_ra,
    DateTime emprestimo_inicio,
    DateTime? emprestimo_fim,
    int? bicicletario_id_devolvido ,
    int bicicletario_id_tirado,
    int bicicleta_id,
    bool cancelado
);
  