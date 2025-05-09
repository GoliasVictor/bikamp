namespace Bikamp.Controllers;

[ApiController]
[Route("bicicletarios")]

public class BicicletarioController(IDbConnection conn) : ControllerBase
{

    private readonly IDbConnection _conn = conn;
    public record RequestCreateBicicletario(double latitude, double longitude);
    [HttpPost("")]
    public async Task<ActionResult<int>> Post(RequestCreateBicicletario request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var next_id = await tran.QuerySingleAsync<int>(@"select COALESCE(max(bicicletario_id) + 1, 0) from bicicletario");
        await tran.ExecuteAsync(
            @"INSERT INTO bicicletario (bicicletario_id, localizacao_latitude, localizacao_longitude) 
            VALUES  (@next_id, @latitude, @longitude)", new
            {
                next_id,
                request.latitude,
                request.longitude

            });
        tran.Commit();
        return Ok(next_id);
    }

    public record BicicletarioPonto(int ponto, StatusPontoId status_ponto_id, int? bicicleta);
    public record class Bicicletario(
        int id,
        double localizacao_latitude,
        double localizacao_longitude,
        bool desativado,
        List<BicicletarioPonto>? pontos
    );
    [HttpGet()]
    public async Task<ActionResult<List<Bicicletario>>> GetAll([FromQuery] bool detalhado)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var bicicletarios = await tran.QueryAsync<(int, double, double, bool)>(@"SELECT 
            bicicletario_id as id, 
            localizacao_latitude, 
            localizacao_longitude,
            desativado
        from bicicletario");
        var result = new Dictionary<int, Bicicletario>();
        foreach (var b in bicicletarios)
            result[b.Item1] = new Bicicletario(b.Item1, b.Item2, b.Item3, b.Item4, detalhado? new() : null);
        if(detalhado){
            var pontos = await tran.QueryAsync<(int, int, StatusPontoId, int?)>(@"SELECT 
                    ponto.bicicletario_id as bicicletario,
                    ponto.ponto_id as ponto,
                    ponto.status_ponto_id as status_ponto_id, 
                    bicicleta.bicicleta_id as bicicleta
                from ponto
                left join bicicleta on bicicleta.bicicleta_id = ponto.bicicleta_id");
            foreach (var ponto in pontos)
                result[ponto.Item1].pontos!.Add(new BicicletarioPonto(ponto.Item2, ponto.Item3, ponto.Item4));
        }
        tran.Commit();
        return Ok(result.Values);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        await tran.ExecuteAsync(
            @"update bicicletario 
            set desativado = true 
            where bicicletario_id = @id;
            
            update ponto
            set status_ponto_id = @STATUS_PONTO_ID_REMOVIDO
            where  bicicletario_id = @id",
            new { 
                STATUS_PONTO_ID_REMOVIDO = StatusPontoId.Removido,
                id 
            }
        );
        tran.Commit();
        return Ok();
    }
}
