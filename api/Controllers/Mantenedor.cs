namespace Bikamp.Controllers;

[ApiController]
[Route("mantenedores/")]

public class MantenedoresController(IDbConnection conn) : ControllerBase
{
    private readonly IDbConnection _conn = conn;
    [HttpGet()]
    public async Task<ActionResult<List<Mantenedor>>> GetAll()
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryAsync<Mantenedor>(
            @"SELECT 
                mantenedor_id,
                cargo_id as cargo, 
                nome,
                senha
            from mantenedor
        ");
        tran.Commit();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Mantenedor>> Get(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        var result = await tran.QueryFirstOrDefaultAsync<Mantenedor>(
            @"SELECT 
                mantenedor_id,
                cargo_id as cargo, 
                nome,
                senha
            from mantenedor
            where mantenedor_id = @id",
            new { id }
        );
        tran.Commit();
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpPost()]
    public async Task<ActionResult> Post(Mantenedor mantenedor)
    {
        if (!Enum.IsDefined(mantenedor.cargo))
            return UnprocessableEntity();
        await _conn.ExecuteAsync(
            @"INSERT INTO mantenedor (mantenedor_id, cargo_id, nome, senha) 
              VALUES (@mantenedor_id, @cargo, @nome, @senha)",
            mantenedor);
        return Ok();
    }

    public record AtualizarMantenedor(int id, string? nome, CargoId? cargo_id);
    [HttpPatch()]
    public async Task<ActionResult> Patch(AtualizarMantenedor request)
    {
        string? camposParaAtualizar = request switch
        {
            { nome: not null, cargo_id: not null, senha: not null } => @"nome = @nome, cargo_id = @cargo_id, senha = @senha",
            { nome: not null, cargo_id: not null } => @"nome = @nome, cargo_id = @cargo_id",
            { nome: not null, senha: not null } => @"nome = @nome, senha = @senha",
            { cargo_id: not null, senha: not null } => @"cargo_id = @cargo_id, senha = @senha",
            { nome: not null } => @"nome = @nome",
            { cargo_id: not null } => @"cargo_id = @cargo_id",
            { senha: not null } => @"senha = @senha",
            _ => null
        };
        if (request.cargo_id is CargoId cargo && !Enum.IsDefined(cargo))
            return UnprocessableEntity();

        if (camposParaAtualizar is null)
            return UnprocessableEntity();

        int rows_affected = await _conn.ExecuteAsync(
            @$"UPDATE mantenedor 
            SET 
                {camposParaAtualizar} 
            WHERE mantenedor_id = @id;",
            request
        );

        if (rows_affected == 0)
            return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        using IDbTransaction tran = _conn.BeginTransaction();
        bool possui_conexao = await tran.QuerySingleAsync<bool>(
            @"select exists(
                select *
                from penalidade
                where mantenedor_id_aplicador = @id
                    or mantenedor_id_perdoador = @id
            )",
            new { id }
        );
        if (possui_conexao)
        {
            return Conflict();
        }
        int rows_affected = await tran.ExecuteAsync(
            @"DELETE FROM mantenedor 
            WHERE mantenedor_id = @id;",
            new { id }
        );
        tran.Commit();
        if (rows_affected == 0)
            return NotFound();
        return Ok();
    }

}
