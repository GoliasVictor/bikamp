namespace Bikamp.Controllers;

[ApiController]
[Route("bicicletarios")]

public class BicicletarioController(IDbConnection conn) : ControllerBase
{

    private readonly IDbConnection _conn = conn;
    public record RequestCreateBicicletario(double latitude, double longitude);
    [HttpPost("")]
    public async Task<ActionResult<int>> CreateBicicletario(RequestCreateBicicletario request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var next_id = await tran.QuerySingleAsync<int>(@"select max(bicicletario_id) + 1 from bicicletario");
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

    public record BicicletarioPonto(int ponto, String status_ponto, int? bicicleta);
    public record class Bicicletario(
        int id,
        double localizacao_latitude,
        double localizacao_longitude,
        List<BicicletarioPonto>? pontos
    );
    [HttpGet()]
    public async Task<ActionResult<List<Bicicletario>>> GetAll([FromQuery] bool detalhado)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var bicicletarios = await tran.QueryAsync<(int, double, double)>(@"SELECT 
            bicicletario_id as id, 
            localizacao_latitude, 
            localizacao_longitude 
        from bicicletario");
        var result = new Dictionary<int, Bicicletario>();
        foreach (var b in bicicletarios)
            result[b.Item1] = new Bicicletario(b.Item1, b.Item2, b.Item3, detalhado? new() : null);
        if(detalhado){
            var pontos = await tran.QueryAsync<(int, int, String, int?)>(@"SELECT 
                    ponto.bicicletario_id as bicicletario,
                    ponto.ponto_id as ponto,
                    ponto.status as status, 
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
        await tran.ExecuteAsync("delete from bicicletario where bicicletario_id = @id", new { id });
        tran.Commit();
        return Ok();
    }
}
