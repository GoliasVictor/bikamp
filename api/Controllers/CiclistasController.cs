namespace Bikamp.Controllers;

[ApiController]
[Route("ciclistas/")]

public class CiclistasController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;

    public record Ciclista(int ciclista_ra);
    [HttpGet()]
    public async Task<ActionResult<List<BicicletaPonto>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        IEnumerable<Ciclista> result;
        result = await tran.QueryAsync<Ciclista>(
            @"select 
                ciclista_ra
            from ciclista
            order by ciclista_ra"
        );
            
        tran.Commit();
        return Ok(result);
    }
}
