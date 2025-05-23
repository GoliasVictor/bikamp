using Bikamp.Repositories;

namespace Bikamp.Controllers;

[ApiController]
[Route("api-bicicletario/")]

public class ApiBicicletarioController(IDbConnection conn, Dac dac, BicicletarioRepository bicicletarioRep, CiclistaRepository ciclistaRep) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    private readonly Dac _dac = dac;
    private readonly BicicletarioRepository _bicicletarioRep = bicicletarioRep;
    private readonly CiclistaRepository _ciclistaRep = ciclistaRep;
    public record RequesicaoEmprestimo(int bicicletario, int ra_aluno);

    public enum StatusSolicitacoaEmprestimo
    {
        Liberado = 1,
        Indisponivel = 2,
        NaoPermitido = 3,
        RaInvalido = 4

    }

    public record RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo status, int? ponto, int? bicicleta);

    [HttpPost("emprestimos")]
    public async Task<ActionResult<RespostaSolicitacaoEmprestimo>> PostEmprestimos(RequesicaoEmprestimo solicitacao)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        if (!_dac.EhAlunoRegulamenteMatriculado(solicitacao.ra_aluno))
            return Conflict();

        int ra = solicitacao.ra_aluno;

        if (await _ciclistaRep.EstaProibido(ra, tran))
            return new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.NaoPermitido, null, null);

        if (!await _bicicletarioRep.Existe(solicitacao.bicicletario, tran))
            return BadRequest();

        if (!await _ciclistaRep.Existe(ra, tran))
            await tran.ExecuteAsync("insert into  ciclista (ciclista_ra) value (@ra); ", new { ra });

        var pontos_possiveis = await _bicicletarioRep.GetPontosPossiveis(solicitacao.bicicletario, tran);
        (int ponto, int bicicleta) = pontos_possiveis[Random.Shared.Next(pontos_possiveis.Count)];
        await tran.ExecuteAsync(
            @"UPDATE ponto 
            SET bicicleta_id = null
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;

            INSERT INTO emprestimo (ciclista_ra, emprestimo_inicio, bicicletario_id_tirado, bicicleta_id) 
            VALUES (@ciclista_ra, now(), @bicicletario_id, @bicicleta_id) ;",
            new
            {
                ciclista_ra = ra,
                bicicletario_id = solicitacao.bicicletario,
                bicicleta_id = bicicleta,
                ponto_id = ponto
            }
        );
        tran.Commit();
        return Ok(new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.Liberado, ponto, bicicleta));
    }

    public record RequestDevolucao(int bicicleta_id, int bicicletario_id, int ponto_id);
    [HttpPatch("ponto/bicicleta")]
    public async Task<ActionResult> AtualizarBicicletaPonto(RequestDevolucao request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var emprestimo = await tran.QueryFirstOrDefaultAsync<(int, DateTime)?>(
            @"select ciclista_ra, emprestimo_inicio 
            from emprestimo 
            where emprestimo_fim is null and  bicicleta_id = @bicicleta_id",
            new { bicicleta_id = request.bicicleta_id }
        );

        if (emprestimo is (int ciclista_ra, DateTime emprestimo_inicio))
            await EmprestimoManager.FecharEmprestimo(tran, ciclista_ra, emprestimo_inicio, request.bicicletario_id);

        await tran.ExecuteAsync(
            @"UPDATE ponto 
            SET 
                bicicleta_id = null
            WHERE bicicleta_id = @bicicleta_id;
            UPDATE ponto 
            SET 
                bicicleta_id = @bicicleta_id 
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;",
            request
        );


        tran.Commit();
        return Ok();
    }

    
}
