using Microsoft.AspNetCore.Mvc;

namespace bikamp.Controllers;



[ApiController]
[Route("emprestimos/")]

public class EmprestimosController : ControllerBase
{
    private readonly MySqlConnection _conn;

    public EmprestimosController(MySqlConnection conn)
    {
        _conn = conn;
    }
    public record RequestEmprestimo(int bicicletario, int id_card);
    public record RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo status, int bicicleta);

    [HttpPost("")]
    public async Task<ActionResult<RespostaSolicitacaoEmprestimo>> PostEmprestimos(RequestEmprestimo solicitacao) {
		throw new NotImplementedException();
    }
    [HttpGet("")]
    public async Task<ActionResult<List<RespostaSolicitacaoEmprestimo>>> GetEmprestimos() {
        return new List<RespostaSolicitacaoEmprestimo>() { 
            new(StatusSolicitacoaEmprestimo.RaInvalido, 0),
            new(StatusSolicitacoaEmprestimo.Indisponivel, 1),
            new(StatusSolicitacoaEmprestimo.Liberado, 2),
            new(StatusSolicitacoaEmprestimo.NaoPermitido, 5) 
        };
    }
 
}
