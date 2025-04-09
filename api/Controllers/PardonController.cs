namespace Bikamp.Controllers;

[ApiController]
[Route("pardon/")]

public class PardonController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn; 

    [HttpPost()]
    public async Task<ActionResult> Post(PardonRequest pardonMe)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var pardonMe_existe = await tran.QuerySingleAsync<bool>(
            @"SELECT EXISTS (
                SELECT * FROM pardon_request
                WHERE ciclista_ra = @ciclista_ra AND pardon_inicio = @pardon_inicio
            )", pardonMe
        );

        if (pardonMe_existe)
            return Conflict("Solicitação de perdão com o id indicado já existe");
        
        await tran.ExecuteAsync(
            @"INSERT INTO pardon_request (ciclista_ra, pardon_inicio, justificativa)
                VALUES (@ciclista_ra, @pardon_inicio, @justificativa)", pardonMe);
        
        tran.Commit();
        return Ok(new { mensagem = "Solicitação registrada com sucesso" });
    }

    [HttpGet()]
    public async Task<ActionResult<List<PardonRequest>>> Get(){
        using IDbTransaction tran = _conn.BeginTransaction();
        var querry = @"SELECT ciclista_ra, pardon_inicio, justificativa FROM pardon_request";
        var pardons = await tran.QueryAsync(querry);     
        tran.Commit();
        return Ok(pardons);       
    }
}
