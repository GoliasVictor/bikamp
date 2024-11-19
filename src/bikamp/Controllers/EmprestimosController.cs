namespace Bikamp.Controllers;

[ApiController]
[Route("emprestimos/")]

public class EmprestimosController(IDbConnection conn, Dac dac) : ControllerBase
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

    [HttpPost("")]
    public async Task<ActionResult<RespostaSolicitacaoEmprestimo>> PostEmprestimos(RequesicaoEmprestimo solicitacao)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        bool matriculado = _dac.EhAlunoRegulamenteMatriculado(solicitacao.ra_aluno);
        if (!matriculado)
        {
            return BadRequest();
        }
        int ra = solicitacao.ra_aluno;

        (bool estaNoBanco, bool proibido) = await tran.QuerySingleAsync<(bool, bool)>(
            @"SELECT 
                EXISTS (
                    SELECT ciclista_ra
                    FROM   ciclista
                    WHERE  ciclista_ra = @ra
                ),
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

        if (proibido)
        {
            return new RespostaSolicitacaoEmprestimo(StatusSolicitacoaEmprestimo.NaoPermitido, null, null);
        }



        var count_bicicletario = await tran.QuerySingleAsync<int>("SELECT count(*) as count FROM bicicletario WHERE bicicletario_id = @bicicletario;",
            new { solicitacao.bicicletario });
        if (count_bicicletario < 1)
        {
            return BadRequest();
        }


        if (!estaNoBanco)
        {
            await tran.ExecuteAsync("insert into  ciclista (ciclista_ra) value (@ra); ", new { ra });
        }

        var posibles_points = (await tran.QueryAsync<(int, int)>(
            @"SELECT ponto.ponto_id AS ponto_retirada,
                    ponto.bicicleta_id AS bicicleta
            FROM ponto
            JOIN bicicleta ON ponto.bicicleta_id = bicicleta.bicicleta_id
            WHERE ponto.bicicletario_id = @bicicletario_id and
                ponto.status = 'online' and
                ponto.bicicleta_id is not null and 
                bicicleta.status = 'ativada';",
            new
            {
                bicicletario_id = solicitacao.bicicletario
            }
        )).ToList();
        (int ponto, int bicicleta) = posibles_points[Random.Shared.Next(posibles_points.Count)];
        await tran.ExecuteAsync(
            @"UPDATE ponto 
            SET bicicleta_id = null
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;

            INSERT INTO emprestimo (ciclista_ra, emprestimo_inicio, bicicletario_id_tirado, bicicleta_id, cancelado) 
            VALUES (@ciclista_ra, now(), @bicicletario_id, @bicicleta_id, false) ;",
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
    public record RequestDevolucao(int bicicleta_id, int bicicletario_id, int ponto_id);
    [HttpPut("devolver")]
    public async Task<ActionResult> Devolver(RequestDevolucao request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        var n_emprestimo = await tran.QueryFirstOrDefaultAsync<(int, DateTime)?>(
            @"select ciclista_ra, emprestimo_inicio 
            from emprestimo 
            where emprestimo_fim is null and  bicicleta_id = @bicicleta_id",
            new { bicicleta_id = request.bicicleta_id }
        );

        if (n_emprestimo is  (int ciclista_ra, DateTime emprestimo_inicio))
        {
            var duration = emprestimo_inicio - DateTime.Now;
            if (duration.TotalHours > MINUTOS_TEMPO_MAXIMO_EMPRESTIMO)
            {
                DateTime? penalidade_fim = DateTime.Now.AddDays(DIAS_DURACAO_PENALIDADE_ATRASO);
                await tran.ExecuteAsync(
                    @"insert into penalidade (penalidade_inicio, ciclista_ra, emprestimo_inicio, tipo_penalidade_id, penalidade_automatica, penalidade_fim) 
                        value (now(), @ciclista_ra, @emprestimo_inicio, @ID_TIPO_PENALIDADE_ATRASO, true, @penalidade_fim)",
                    new
                    {
                        ID_TIPO_PENALIDADE_ATRASO = ID_TIPO_PENALIDADE_ATRASO,
                        ciclista_ra,
                        emprestimo_inicio,
                        penalidade_fim
                    }
                );
            }
            await tran.ExecuteAsync(
                @"update emprestimo 
                set emprestimo_fim = now(),
                    bicicletario_id_devolvido = @bicicletario_id_devolvido  
                where ciclista_ra = @ciclista_ra and  emprestimo_inicio = @emprestimo_inicio;",
                new
                {
                    bicicletario_id_devolvido = request.bicicletario_id,
                    ciclista_ra,
                    emprestimo_inicio
                }
            );
        }
        await tran.ExecuteAsync(
            @"UPDATE ponto 
            SET 
                bicicleta_id = @bicicleta_id 
            WHERE bicicletario_id = @bicicletario_id and ponto_id = @ponto_id;",
            request
        );


        tran.Commit();
        return Ok();
    }


}
