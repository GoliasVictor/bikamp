namespace Bikamp.Controllers;

[ApiController]
[Route("emprestimos/")]

public class EmprestimosController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;


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
                bicicleta_id
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
        var emprestimo_info = await tran.QueryFirstOrDefaultAsync<(int, bool)?>(
                @"select 
                    bicicleta_id,
                    emprestimo_fim is not null 
                from emprestimo 
                where ciclista_ra =  @ciclista_ra 
                and emprestimo_inicio = @emprestimo_inicio", 
            new {
                ciclista_ra = request.ciclista_ra, 
                emprestimo_inicio = request.emprestimo_inicio
            }
        );
        if(emprestimo_info is null){
            return NotFound("Emprestimo não existe");
        }
        (int bicicleta_id, bool fechado) = emprestimo_info.Value;
        if (fechado){
            return Conflict("Emprestimo já está fechado");
        }
        
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
                );
                UPDATE bicicleta 
                SET status_bicicleta_id = @STATUS_BICICLETA_ID_PERDIDA 
                WHERE bicicleta_id = @id;
                ",
                new
                {
                    bicicleta_id = bicicleta_id,
                    ciclista_ra = request.ciclista_ra, 
                    emprestimo_inicio = request.emprestimo_inicio,
                    TIPO_PENALIDADE_ID_PERDA_BICICLETA = TIPO_PENALIDADE_ID_PERDA_BICICLETA,
                    STATUS_BICICLETA_ID_PERDIDA = StatusBicicletaId.Perdida
                }
            );
        }   
        await EmprestimoManager.FecharEmprestimo(tran, request.ciclista_ra, request.emprestimo_inicio, null);
        tran.Commit();
        return Ok();
    }
    
}
