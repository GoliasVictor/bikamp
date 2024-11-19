using System.Security.Cryptography.X509Certificates;
using Dapper.Transaction;
using Microsoft.AspNetCore.Mvc;

namespace bikamp.Controllers;



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
                nome
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
                nome
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
		using IDbTransaction tran = _conn.BeginTransaction();
		if (!Enum.IsDefined(mantenedor.cargo))
			return UnprocessableEntity();
		await tran.ExecuteAsync(
			@"INSERT INTO mantenedor (mantenedor_id, cargo_id, nome) 
			  VALUES (@mantenedor_id, @cargo, @nome)",
			mantenedor);
		tran.Commit();
		return Ok();
	}

	public record AtualizarMantenedor(int id, string? nome, Cargo? cargo_id);
	[HttpPut()]
	public async Task<ActionResult> Put(AtualizarMantenedor request)
	{
		string? camposParaAtualizar = request switch
		{
			{ nome: not null, cargo_id: not null } => @"nome = @nome, cargo_id = @cargo_id",
			{ nome: not null } => @"nome = @nome",
			{ cargo_id: not null } => @"cargo_id = @cargo_id",
			_ => null
		};
		if (request.cargo_id is Cargo cargo && !Enum.IsDefined(cargo))
			return UnprocessableEntity();

		if (camposParaAtualizar is null)
			return UnprocessableEntity();

		using IDbTransaction tran = _conn.BeginTransaction();
		int rows_affected = await tran.ExecuteAsync(
			@$"UPDATE mantenedor 
			SET 
				{camposParaAtualizar} 
			WHERE mantenedor_id = @id;",
			request
		);
		tran.Commit();
		if(rows_affected == 0){
			return NotFound();
		}
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
		if(possui_conexao){
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