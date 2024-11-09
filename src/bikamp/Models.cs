public record Mantenedor(int mantenedor_id, int cargo_id, string nome);
public record Penalidade(int id_penalidade, int id_mantenedor, int id_emprestimo);
public record PontosDisponiveis(int ponto, int bicicleta, int bicicletario);
public record RequestDevolucao(int id_bicicleta);
public enum  StatusSolicitacoaEmprestimo {
    Liberado,
    Indisponivel,
    NaoPermitido,
    RaInvalido
}