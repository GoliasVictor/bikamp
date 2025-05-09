namespace Bikamp.Controllers;

[ApiController]
[Route("penalidades/")]

public class PenalidaesController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    public record Penalidade(
        DateTime penalidade_inicio,
        DateTime? penalidade_fim,
        int ciclista_ra,
        DateTime emprestimo_inicio,
        int tipo_penalidade_id,
        string? detalhes,
        int? mantenedor_id_aplicador,
        int? mantenedor_id_perdoador,
        bool penalidade_automatica,
        string? motivacao_perdao
    );
    [HttpGet]
    public async Task<ActionResult<List<Penalidade>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryAsync<Penalidade>(
            @"SELECT 
                penalidade_inicio,
                penalidade_fim,
                ciclista_ra,
                emprestimo_inicio,
                tipo_penalidade_id,
                detalhes,
                mantenedor_id_aplicador,
                mantenedor_id_perdoador,
                penalidade_automatica,
                motivacao_perdao
            from penalidade"
        );
        tran.Commit();
        return Ok(result);
    }
    public record NovaPenalidadeManual(
        int mantenedor_id_aplicador,
        int tipo_penalidade_id,
        DateTime? penalidade_fim,
        int ciclista_ra,
        DateTime emprestimo_inicio,
        string? detalhes
    );
    [HttpPost("manual")]
    public async Task<ActionResult> Post(NovaPenalidadeManual penalidade)
    {
        DateTime penalidade_inicio = DateTime.Now;
        if (penalidade.penalidade_fim < penalidade_inicio)
            return UnprocessableEntity("Não e possive o fim da penalidade ser no passado");


        using IDbTransaction tran = _conn.BeginTransaction();
        (bool tipoExiste, bool emprestimoExiste, int? cargo_id)
            = await tran.QuerySingleAsync<(bool, bool, int?)>(
            @"select
                exists(
                    select * 
                    from tipo_penalidade 
                    where tipo_penalidade_id =  @tipo_penalidade_id
                ),
                exists(
                    select * 
                    from emprestimo 
                    where emprestimo_inicio = @emprestimo_inicio 
                      and ciclista_ra = @ciclista_ra
                ),
                (select cargo_id from mantenedor where mantenedor_id = @mantenedor_id)",
            new
            {
                tipo_penalidade_id = penalidade.tipo_penalidade_id,
                emprestimo_inicio = penalidade.emprestimo_inicio,
                ciclista_ra = penalidade.ciclista_ra,
                mantenedor_id = penalidade.mantenedor_id_aplicador
            }
        );
        if (cargo_id is null)
            return Conflict("Aplicador da penalidade não existe");
        if ((CargoId)cargo_id! is not CargoId.Supervisor and not CargoId.Administrador)
            return Conflict("Aplicador da pendalidade precisa possuir o cargo de Supervisor ou Administrador");
        if (!emprestimoExiste)
            return Conflict("Emprestimo indicado não existe");
        if (!tipoExiste)
            return Conflict("Não existe nenhum tipo de penalidade com o id indicado em 'tipo_penalidade_id'");
        await tran.ExecuteAsync(
            @"INSERT INTO penalidade (  
                penalidade_inicio, 
                penalidade_fim,
                ciclista_ra,
                emprestimo_inicio,
                tipo_penalidade_id, 
                penalidade_automatica,
                detalhes,
                mantenedor_id_aplicador
            ) 
            VALUES (
                @penalidade_inicio,
                @penalidade_fim,
                @ciclista_ra,
                @emprestimo_inicio,
                @tipo_penalidade_id,
                False,
                @detalhes,
                @mantenedor_id_aplicador
            )",
            new
            {
                penalidade_inicio = penalidade_inicio,
                mantenedor_id_aplicador = penalidade.mantenedor_id_aplicador,
                tipo_penalidade_id = penalidade.tipo_penalidade_id,
                penalidade_fim = penalidade.penalidade_fim,
                ciclista_ra = penalidade.ciclista_ra,
                emprestimo_inicio = penalidade.emprestimo_inicio,
                detalhes = penalidade.detalhes
            }
        );
        tran.Commit();
        return Ok();
    }
    public record RequestPerdoarPenalidade(
        int ciclista_ra,
        DateTime emprestimo_inicio,
        DateTime penalidade_inicio,
        int mantenedor_id_perdoador,
        string motivacao_perdao
    );
    [HttpPatch("")]
    public async Task<ActionResult> Perdoar(RequestPerdoarPenalidade request)
    {
        using IDbTransaction tran = _conn.BeginTransaction();

        int? cargo_id = await tran.QuerySingleAsync<int?>(
            @"select cargo_id 
            from mantenedor 
            where mantenedor_id = @mantenedor_id",
        new
        {
            mantenedor_id = request.mantenedor_id_perdoador
        });

        if (cargo_id is null)
            return Conflict("Aplicador da penalidade não existe");

        if ((CargoId)cargo_id! is not CargoId.Supervisor and not CargoId.Administrador)
            return Conflict("Aplicador da pendalidade precisa possuir o cargo de Supervisor ou Administrador");

        await tran.ExecuteAsync(
            @"UPDATE penalidade 
            SET 
                mantenedor_id_perdoador = @mantenedor_id_perdoador,
                motivacao_perdao = @motivacao_perdao 
            WHERE ciclista_ra = @ciclista_ra 
              and penalidade_inicio = @penalidade_inicio
              and emprestimo_inicio = @penalidade_inicio;",
            new
            {
                ciclista_ra = request.ciclista_ra,
                emprestimo_inicio = request.emprestimo_inicio,
                penalidade_inicio = request.penalidade_inicio,
                mantenedor_id_perdoador = request.mantenedor_id_perdoador,
                motivacao_perdao = request.motivacao_perdao
            }
            );
        tran.Commit();
        return Ok();
    }

}


