using System.Transactions;
using Bikamp;
using Dapper.Transaction;
using Microsoft.AspNetCore.Mvc;

namespace bikamp.Controllers;



[ApiController]
[Route("emprestimos/")]

public class EmprestimosController : ControllerBase
{
    private readonly IDbConnection _conn;
    private readonly Dac _dac;

    public EmprestimosController(IDbConnection conn, Dac dac)
    {
        _conn = conn;
        _dac = dac;
    }
    public record RequesicaoEmprestimo(int bicicletario, int id_card);
    public enum  StatusSolicitacoaEmprestimo {
        Liberado,
        Indisponivel,
        NaoPermitido,
        RaInvalido
    }
    public record RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo status, int? bicicleta);

    [HttpPost("")]
    public async Task<ActionResult<RespostaSolicitacaoEmprestimo>> PostEmprestimos(RequesicaoEmprestimo solicitacao) {
        _conn.Open();
        using IDbTransaction tran = _conn.BeginTransaction(); 

        int? n_ra = _dac.ObterRaAlunoCartao(solicitacao.id_card);
        if(n_ra is null){
            return new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.RaInvalido, null);
        }
        int ra = n_ra.Value;
        var count_bicicletario = await tran.QuerySingleAsync<int>("SELECT count(*) as count FROM bicicletario WHERE bicicletario_id = @bicicletario;", 
            new { solicitacao.bicicletario });
        if(count_bicicletario < 1){
            return BadRequest();
        }


        throw new NotImplementedException();
    }
 
    [HttpGet("")]
    public async Task<ActionResult<List<Emprestimo>>> GetEmprestimos([FromQuery]bool? aberto) {
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
        ", new{
            aberto = aberto
        });
        tran.Commit();
        return Ok(result);  
    }
 
}
