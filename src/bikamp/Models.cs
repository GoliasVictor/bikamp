public record Mantenedor(int mantenedor_id, int cargo_id, string nome);
public record Penalidade(int id_penalidade, int id_mantenedor, int id_emprestimo);
public record Bicicleta(int id, string status);
public record BicicletaPonto(long id, string status, long bicicletario, long ponto);