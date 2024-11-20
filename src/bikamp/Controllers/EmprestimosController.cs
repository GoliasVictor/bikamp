namespace Bikamp.Controllers;

[ApiController]
[Route("emprestimos/")]

public class EmprestimosController(IDbConnection conn, Dac dac) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    private readonly Dac _dac = dac;


    [HttpGet("")]
    public async Task<ActionResult<List<Emprestimo>>> GetEmprestimos([FromQuery] bool? aberto)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryAsync<Emprestimo>(@"select 
                ciclista_ra, 
                emprestimo_inicio, 
                emprestimo_fim,
                bicicletario_id_devolvido,
                bicicletario_id_tirado,
                bicicleta_id,
                cancelado
            from emprestimo
            where  @aberto is null or not (emprestimo_fim is null xor @aberto) ;
        ", new
        {
            aberto = aberto
        });
        tran.Commit();
        return Ok(result);
    }
}
