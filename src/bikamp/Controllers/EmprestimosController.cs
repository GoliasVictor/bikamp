namespace Bikamp.Controllers;

[ApiController]
[Route("emprestimos/")]

public class EmprestimosController(IDbConnection conn, Dac dac) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    private readonly Dac _dac = dac;


    [HttpGet()]
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
    public record RequestFecharEmprestimo(int ciclista_ra, DateTime emprestimo_inicio, bool perda_bicicleta);
    [HttpPatch("fechar")]
    public async Task<ActionResult<List<Emprestimo>>> Fechar(RequestFecharEmprestimo request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        if(request.perda_bicicleta){
            await tran.ExecuteAsync(
                @"INSERT INTO penalidade(
                    penalidade_inicio, 
                    ciclista_ra, 
                    emprestimo_inicio, 
                    tipo_penalidade_id, 
                    penalidade_automatica, 
                    penalidade_fim
                ) 
                VALUES (
                    now(),
                    @ciclista_ra,
                    @emprestimo_inicio,
                    @TIPO_PENALIDADE_ID_PERDA_BICICLETA,
                    True,
                    Null
                )",
                new
                {
                    TIPO_PENALIDADE_ID_PERDA_BICICLETA = TIPO_PENALIDADE_ID_PERDA_BICICLETA,
                }
            );
        }   
        await EmprestimoManager.FecharEmprestimo(tran, request.ciclista_ra, request.emprestimo_inicio, null);
        tran.Commit();
        return Ok();
    }
    public record RequestPerdoarEmprestimo(int ciclista_ra, DateTime emprestimo_inicio, int mantenedor_id);

 
}
