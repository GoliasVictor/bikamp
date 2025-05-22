namespace Bikamp.Controllers;

[ApiController]
[Route("interno/")]

public class InternoController(IDbConnection conn, Dac dac) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    private readonly Dac _dac = dac;

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

        if (CiclistaEstaProibido(ra, tran))
            return new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.NaoPermitido, null, null);



        var count_bicicletario = await tran.QuerySingleAsync<int>("SELECT count(*) as count FROM bicicletario WHERE bicicletario_id = @bicicletario;",
            new { solicitacao.bicicletario });
        if (count_bicicletario < 1)
            return BadRequest();


        if (!CiclistaEstaNoBanco(ra, tran))
            await tran.ExecuteAsync("insert into  ciclista (ciclista_ra) value (@ra); ", new { ra });

        var posibles_points = (await tran.QueryAsync<(int, int)>(
            @"SELECT ponto.ponto_id AS ponto_retirada,
                    ponto.bicicleta_id AS bicicleta
            FROM ponto
            JOIN bicicleta ON ponto.bicicleta_id = bicicleta.bicicleta_id
            WHERE ponto.bicicletario_id = @bicicletario_id and
                ponto.status_ponto_id = @STATUS_PONTO_ID_ONLINE and
                ponto.bicicleta_id is not null and 
                bicicleta.status_bicicleta_id = @STATUS_BICICLETA_ID_ATIVA;",
            new
            {
                STATUS_PONTO_ID_ONLINE = StatusPontoId.Online,
                STATUS_BICICLETA_ID_ATIVA = StatusBicicletaId.Ativada,
                bicicletario_id = solicitacao.bicicletario
            }
        )).ToList();
        (int ponto, int bicicleta) = posibles_points[Random.Shared.Next(posibles_points.Count)];
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

    private async bool CiclistaEstaNoBanco(int ra, IDBTransaction transaction)
    {
        using transaction;
        return await transaction.QuerrySingleAsync<bool>(
            @"SELECT
                EXISTS (
                    SELECT ciclista_ra
                    FROM ciclista
                    WHERE ciclista_ra = @ra
                )",
            new
            {
                ra
            }
        );
    }

    private async bool CiclistaEstaProibido(int ra, IDBTransaction transaction)
    {
        using transaction;
        return await transaction.QuerrySingleAsync<bool>(
             @"SELECT
                (
                    EXISTS (
                        SELECT *
                        FROM penalidade
                        WHERE ciclista_ra = @ra
                        AND (penalidade_fim IS NULL OR Now() < penalidade_fim)
                    )
                    OR EXISTS(
                        SELECT * 
                        FROM emprestimo 
                        WHERE ciclista_ra = @ra
                        AND (
                            emprestimo_fim IS NULL
                            OR Now() > Timestampadd(minute, @MINUTOS_TEMPO_MAXIMO_EMPRESTIMO, emprestimo_inicio)
                        )
                    ) 
                )",
            new
            {
                MINUTOS_TEMPO_MAXIMO_EMPRESTIMO = MINUTOS_TEMPO_MAXIMO_EMPRESTIMO,
                ra
            }
        );
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
