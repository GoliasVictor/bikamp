using MySqlConnector;
using Dapper;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient(_ =>  new MySqlConnection(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapGet("/bicicletario/{id}/pontos-disponiveis", (int id,  MySqlConnection connection) =>
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
})
.WithOpenApi();
 
app.Run();

public record PontosDisponiveis(int ponto, int bicicleta, int bicicletario);