namespace Bikamp.Controllers;

[ApiController]
[Route("bicicletas/")]

public class BicicletasController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    [HttpGet()]
    public async Task<ActionResult<List<BicicletaPonto>>> GetAll([FromQuery] bool? perdidas)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        IEnumerable<BicicletaPonto> result;
        if (perdidas == true)
        {
            result = await tran.QueryAsync<BicicletaPonto>(
                @"select 
                    bicicleta.bicicleta_id as id,
                    bicicleta.status_bicicleta_id as status,
                    bicicleta.bicicleta_patrimonio as bicicleta_patrimonio,
                    ponto.bicicletario_id as bicicletario,
                    ponto.ponto_id as ponto 
                from bicicleta
                left join ponto on ponto.bicicleta_id = bicicleta.bicicleta_id
                left join emprestimo on emprestimo.bicicleta_id = bicicleta.bicicleta_id 
                    and emprestimo.emprestimo_fim is null
                where ponto.ponto_id is null 
                  and emprestimo.ciclista_ra is null 
                  and bicicleta.status_bicicleta_id = @STATUS_BICICLETA_ID_ATIVADA",
                  new {
                    STATUS_BICICLETA_ID_ATIVADA = StatusBicicletaId.Ativada
                  }
            );
            
        } else {
            result = await tran.QueryAsync<BicicletaPonto>(@"SELECT 
                    bicicleta.bicicleta_id as id,
                    bicicleta.status_bicicleta_id as status, 
                    bicicleta.bicicleta_patrimonio as bicicleta_patrimonio,
                    ponto.bicicletario_id as bicicletario,
                    ponto.ponto_id as ponto 
                from bicicleta
                left join ponto on ponto.bicicleta_id = bicicleta.bicicleta_id;"
            );
        }
        tran.Commit();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<BicicletaPonto>> Get(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryFirstOrDefaultAsync<BicicletaPonto>(@"SELECT 
                bicicleta.bicicleta_id as id,
                bicicleta.status_bicicleta_id as status, 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto 
            from bicicleta
            left join ponto on ponto.bicicleta_id = bicicleta.bicicleta_id
            where bicicleta.bicicleta_id = @id
        ", new { id });
        tran.Commit();
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpPost()]
    public async Task<ActionResult> Post(PostBicicleta bicicleta)
    {
        if (!Enum.IsDefined(bicicleta.status))
            return UnprocessableEntity();
        using IDbTransaction tran = _conn.BeginTransaction();
        string patrimonio = bicicleta.bicicleta_patrimonio.ToUpper();
        uint next_id = await tran.QuerySingleAsync<uint>("select max(bicicleta_id)+1 from bicicleta");
        await tran.ExecuteAsync(
            @"INSERT INTO bicicleta (
                bicicleta_id,
                bicicleta_patrimonio,
                status_bicicleta_id
            ) 
            VALUES (
                @id,
                @bicicleta_patrimonio,
                @status
            )", new
            {
                id = next_id, 
                bicicleta_patrimonio = patrimonio,
                status = bicicleta.status
            });
        tran.Commit();
        return Ok(new Bicicleta(
            id: next_id,
            bicicleta_patrimonio: patrimonio,
            status: bicicleta.status
        ));
    }

    [HttpPut("")]
    public async Task<ActionResult> Put(Bicicleta bicicleta)
    {
        await _conn.ExecuteAsync("UPDATE bicicleta SET status_bicicleta_id = @status WHERE bicicleta_id = @id;", bicicleta);
        return Ok();
    }

}
