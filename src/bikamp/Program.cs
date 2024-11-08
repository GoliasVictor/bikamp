using MySqlConnector;
using Dapper;
using Bikamp;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient(_ =>  new MySqlConnection(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddTransient(_ =>  new Dac());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapGet("/bicicletarios/{id}/pontos-disponiveis", (int id,  MySqlConnection connection) =>
{

    var query = @"
    SELECT 
            ponto.ponto_id AS ponto,
            ponto.bicicleta_id AS bicicleta,
            ponto.bicicletario_id AS bicicletario
    FROM ponto
    JOIN bicicleta ON ponto.bicicleta_id = bicicleta.bicicleta_id
    WHERE ponto.bicicletario_id = @bicicletario_id and
        ponto.status = 'online' and
        ponto.bicicleta_id is not null and 
        bicicleta.status = 'ativada';";
    var resultados = connection.Query<PontosDisponiveis>(query, new { 
        bicicletario_id = id 
    });
    return resultados;
});


app.MapGet("/emprestimos", () => {

    return new List<RespostaSolicitacaoEmprestimo>() { 
        new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.RaInvalido, 0),
        new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.Indisponivel, 1),
        new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.Liberado, 2),
        new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.NaoPermitido, 5) 
    };
});


app.MapGet("/aluno/{ra}", (int ra, Dac dac ) => {
    return dac.ObterAluno(ra);
});

app.MapGet("/mantenedores", () => {

    return new List<Mantenedor>() {
        new Mantenedor(5,6, "Carlinhos mil gra") 
    };
});

app.MapPost("/emprestimos", (SolicitacaoEmprestimo solicitacao) => {

    return Results.Ok(new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.Indisponivel, 0));
});


app.MapPost("/penalidades", (Penalidade penalidade) => {

    return Results.Ok(new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.Indisponivel, 0));
});

app.MapGet("/ciclista/{id}/permitido", (int id) => {
    return 0;
});
 

app.Run();

public record Mantenedor(int mantenedor_id, int cargo_id, string nome);
public record Penalidade(int id_penalidade, int id_mantenedor, int id_emprestimo);
public record PontosDisponiveis(int ponto, int bicicleta, int bicicletario);
public record SolicitacaoEmprestimo(int bicicletario, int id_card);
public record RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo status, int bicicleta);
public enum  StatusSolicitacoaEmprestimo {
    Liberado,
    Indisponivel,
    NaoPermitido,
    RaInvalido
}