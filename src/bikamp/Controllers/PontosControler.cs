namespace Bikamp.Controllers;

[ApiController]
[Route("cargo/")]

public class CargoController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    public record Cargo(int cargo_id, string nome);
    [HttpGet()]
    public async Task<ActionResult<List<Cargo>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var result = await tran.QueryAsync<Cargo>(
            @"select 
                cargo_id,
                cargo_nome as nome
            from cargo"
        );
    
        tran.Commit();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Cargo>> Get(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var result = await tran.QueryFirstOrDefaultAsync<Cargo>(
            @"select 
                cargo_id,
                cargo_nome as nome
            from cargo 
            where cargo_id = @cargo_id",
            new {
                cargo_id = @id
            }
        );
    
        tran.Commit();
        return Ok(result);
    }
}
