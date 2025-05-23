using Bikamp.Repositories;

namespace Bikamp.Controllers;

[ApiController]
[Route("ciclistas/")]

public class CiclistasController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;

    [HttpGet()]
    public async Task<ActionResult<List<Ciclista>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var ciclista_rep =  new CiclistaRepository();
        var result = await ciclista_rep.Todos(tran);
        tran.Commit();
        return Ok(result);
    }
}
