namespace Bikamp.Controllers;

[ApiController]
[Route("tipo-penalidade/")]

public class TipoPenalidadeController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    public record TipoPenalidade(int tipo_penalidade_id, string nome, string descricao);
    [HttpGet()]
    public async Task<ActionResult<List<TipoPenalidade>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var result = await tran.QueryAsync<TipoPenalidade>(
            @"select 
                tipo_penalidade_id,
                nome,
                descricao 
            from tipo_penalidade"
        );
    
        tran.Commit();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<TipoPenalidade>> Get(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var result = await tran.QueryFirstOrDefaultAsync<TipoPenalidade>(
            @"select 
                tipo_penalidade_id,
                nome,
                descricao 
            from tipo_penalidade
            where tipo_penalidade_id = @tipo_penalidade_id",
            new {
                tipo_penalidade_id = @id
            }
        );
    
        tran.Commit();
        return Ok(result);
    }
}
