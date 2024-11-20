namespace Bikamp.Controllers;



[ApiController]
[Route("pontos/")]

public class PontosController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    public record PontoInfo(int bicicletario, int ponto, string status_ponto, int? bicicleta, string status_bicicleta);

    [HttpGet("")]
    public async Task<ActionResult<List<PontoInfo>>> Get([FromQuery] int? id_bicicletario)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var pontos = await tran.QueryAsync<PontoInfo>(@"SELECT 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto,
                ponto.status as status_ponto, 
                bicicleta.bicicleta_id as bicicleta,
                bicicleta.status as status_bicicleta
            from ponto
            left join bicicleta on bicicleta.bicicleta_id = ponto.bicicleta_id
            where @id_bicicletario is null or ponto.bicicletario_id = @id_bicicletario", new { id_bicicletario });
        tran.Commit();
        return Ok(pontos);
    }


    [HttpGet("{bicicletario_id}/{ponto_id}")]
    public async Task<ActionResult<PontoInfo>> Get(int bicicletario_id, int ponto_id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryFirstOrDefaultAsync<PontoInfo>(@"SELECT 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto,
                ponto.status as status_ponto, 
                bicicleta.bicicleta_id as bicicleta,
                bicicleta.status as status_bicicleta
            from ponto
            left join bicicleta on bicicleta.bicicleta_id = ponto.bicicleta_id
            where  ponto.bicicletario_id = @bicicletario_id and ponto.ponto_id = @ponto_id", new { bicicletario_id, ponto_id });
        tran.Commit();
        if (result == null)
            return NotFound();
        return Ok(result);
    }
    public record NovoPonto(int bicicletario_id, int ponto_id, string status);
    [HttpPost("")]
    public async Task<ActionResult> Post(NovoPonto ponto)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        await tran.ExecuteAsync(
            @"INSERT INTO ponto (bicicletario_id, ponto_id, status) 
            VALUES  (@bicicletario_id, @ponto_id, @status)",
            ponto
        );
        tran.Commit();
        return Ok();
    }
    public record AtualizacaoPonto(int bicicletario_id, int ponto_id, string status);

    [HttpPut("")]
    public async Task<ActionResult> Put(AtualizacaoPonto ponto)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        await tran.ExecuteAsync(
            @"UPDATE ponto 
            SET 
                  status = @status 
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;",
            ponto);
        tran.Commit();
        return Ok();
    }

 


    [HttpDelete("{bicicletario_id}/{ponto_id}")]
    public async Task<ActionResult> Put(int bicicletario_id, int ponto_id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        int rows_affected = await tran.ExecuteAsync(
            @"DELETE FROM ponto 
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;",
            new { bicicletario_id, ponto_id });
        tran.Commit();
        if (rows_affected == 0)
            return NotFound();
        return Ok();
    }

}
