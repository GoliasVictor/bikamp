namespace Bikamp.Controllers;



[ApiController]
[Route("pontos/")]

public class PontosController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    public record PontoInfo(
        int bicicletario,
        int ponto,
        StatusPontoId status_ponto,
        int? bicicleta,
        StatusBicicletaId? status_bicicleta
    );

    [HttpGet("")]
    public async Task<ActionResult<List<PontoInfo>>> Get(
        [FromQuery] int? id_bicicletario,
        [FromQuery] List<StatusPontoId>? status)
    {
        string status_condition = "";
        if (status is not null && status.Count > 0)
        {
            status_condition = "and ponto.status_ponto_id in @status";
        }
        var pontos = await _conn.QueryAsync<PontoInfo>(@$"SELECT 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto,
                ponto.status_ponto_id as status_ponto, 
                bicicleta.bicicleta_id as bicicleta,
                bicicleta.status_bicicleta_id as status_bicicleta
            from ponto
            left join bicicleta on bicicleta.bicicleta_id = ponto.bicicleta_id
            where (@id_bicicletario is null or ponto.bicicletario_id = @id_bicicletario)
              {status_condition}",
            new
            {
                id_bicicletario,
                status = status
            });
        return Ok(pontos);
    }


    [HttpGet("{bicicletario_id}/{ponto_id}")]
    public async Task<ActionResult<PontoInfo>> Get(int bicicletario_id, int ponto_id)
    {
        var result = await _conn.QueryFirstOrDefaultAsync<PontoInfo>(@"SELECT 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto,
                ponto.status_ponto_id as status_ponto, 
                bicicleta.bicicleta_id as bicicleta,
                bicicleta.status_bicicleta_id as status_bicicleta
            from ponto
            left join bicicleta on bicicleta.bicicleta_id = ponto.bicicleta_id
            where  ponto.bicicletario_id = @bicicletario_id and ponto.ponto_id = @ponto_id", new { bicicletario_id, ponto_id });
        if (result == null)
            return NotFound();
        return Ok(result);
    }
    public record NovoPonto(int bicicletario_id, int ponto_id, StatusPontoId status_ponto_id);
    [HttpPost("")]
    public async Task<ActionResult> Post(NovoPonto ponto)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        (bool bicicletario_existe, bool ponto_existe) = await tran.QuerySingleAsync<(bool, bool)>(
            @"select 
                exists(
                    select * 
                    from bicicletario
                    where bicicletario_id = @bicicletario_id and not desativado 
                ),
                exists(
                    select * 
                    from ponto 
                    where bicicletario_id = @bicicletario_id 
                    and ponto_id = @ponto_id
                );",
            new
            {
                ponto_id = ponto.ponto_id,
                bicicletario_id = ponto.bicicletario_id
            });
        if (!bicicletario_existe)
            return Conflict("Não existe bicicletario com o id indicado que esteja ativo");

        if (ponto_existe)
            return Conflict("Já existe um ponto com o id indicado");


        await tran.ExecuteAsync(
            @"INSERT INTO ponto (bicicletario_id, ponto_id, status_ponto_id) 
            VALUES  (@bicicletario_id, @ponto_id, @status_ponto_id)",
            ponto
        );
        tran.Commit();
        return Ok();
    }
    public record AtualizacaoPonto(int bicicletario_id, int ponto_id, string status);

    [HttpPatch("")]
    public async Task<ActionResult> Patch(AtualizacaoPonto ponto)
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
}
