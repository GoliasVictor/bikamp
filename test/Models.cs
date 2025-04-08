namespace Test;

interface IPrimaryKey{};
interface IPrimaryKey<T> : IPrimaryKey{};


interface Tabela {
    IPrimaryKey getPk();
}

record PardonRequest (int ciclista_ra, DateTime pardon_inicio, string justificativa
) : Tabela {
    public record PK (int ciclista_ra, DateTime pardon_inicio) : IPrimaryKey<PardonRequest>;
    public IPrimaryKey getPk() => new PK(ciclista_ra, pardon_inicio);
};

record Mantenedor (
    int mantenedor_id, 
    int cargo_id, 
    string nome,
    string senha
) : Tabela {
    public record PK (int id) : IPrimaryKey<Mantenedor>;
    public IPrimaryKey getPk() => new PK(mantenedor_id);

};
record Ciclista (
    int ciclista_ra
) : Tabela {
    public record PK (int ra) : IPrimaryKey<Ciclista>;
    public IPrimaryKey getPk() => new PK(ciclista_ra);
};
record Bicicletario(
    int bicicletario_id,
    double localizacao_latitude, 
    double localizacao_longitude
) : Tabela {
    public record PK (int id) : IPrimaryKey<Bicicletario>;
    public IPrimaryKey getPk() => new PK(bicicletario_id);

};
record Bicicleta (
    int bicicleta_id,
    int status_bicicleta_id
) : Tabela {
    public record PK (int id) : IPrimaryKey<Bicicleta>;
    public IPrimaryKey getPk() => new PK(bicicleta_id);
};
record Ponto(
    int ponto_id,
    int bicicletario_id,
    int status_ponto_id,
    int? bicicleta_id
) : Tabela {
    public record PK (int bicicletario_id, int ponto_id) : IPrimaryKey<Ponto>;
    public IPrimaryKey getPk() => new PK(bicicletario_id, ponto_id);
};
record Emprestimo (
    int ciclista_ra,
    DateTime emprestimo_inicio,
    DateTime? emprestimo_fim, 
    int bicicletario_id_tirado, 
    int? bicicletario_id_devolvido,
    int bicicleta_id
) : Tabela {
    public record PK (int ciclista_ra, DateTime emprestimo_inicio) : IPrimaryKey<Emprestimo>;
    public IPrimaryKey getPk() => new PK(ciclista_ra, emprestimo_inicio);
};
record Penalidade (
    DateTime penalidade_inicio,
    int ciclista_ra, 
    DateTime emprestimo_inicio,
    int tipo_penalidade_id,
    bool penalidade_automatica,
    DateTime? penalidade_fim,
    string? detalhes, 
    int mantenedor_id_aplicador,
    int? mantenedor_id_perdoador,
    int? motivacao_perdao
) : Tabela {
    public record PK ( 
        DateTime penalidade_inicio, 
        int ciclista_ra, 
        DateTime emprestimo_inicio
    ) : IPrimaryKey<Penalidade>;

    public IPrimaryKey getPk() => new PK(penalidade_inicio, ciclista_ra, emprestimo_inicio);
}

