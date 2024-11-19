namespace Bikamp.Controllers;

[ApiController]
[Route("bicicletas/")]

public class BicicletasController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    [HttpGet()]
    public async Task<ActionResult<List<BicicletaPonto>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryAsync<BicicletaPonto>(@"SELECT 
                bicicleta.bicicleta_id as id,
                bicicleta.status as status, 
                ponto.bicicletario_id as bicicletario,
                ponto.ponto_id as ponto 
            from bicicleta
            left join ponto on ponto.bicicleta_id = bicicleta.bicicleta_id;
        ");
        tran.Commit();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<BicicletaPonto>> Get(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryFirstOrDefaultAsync<BicicletaPonto>(@"SELECT 
                bicicleta.bicicleta_id as id,
                bicicleta.status as status, 
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
    public async Task<ActionResult> Post(Bicicleta bicicleta)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        await tran.ExecuteAsync("INSERT INTO bicicleta (bicicleta_id, status) VALUES  (@id, @status)", bicicleta);
        tran.Commit();
        return Ok();
    }

    [HttpPut("")]
    public async Task<ActionResult> Put(Bicicleta bicicleta)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        await tran.ExecuteAsync("UPDATE bicicleta SET status = @status WHERE bicicleta_id = @id;", bicicleta);
        tran.Commit();
        return Ok();
    }

}
