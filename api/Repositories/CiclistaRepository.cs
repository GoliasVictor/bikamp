using System.Runtime.CompilerServices;

namespace Bikamp.Repositories;

class CiclistaRepository()
{
	public Task<IEnumerable<Ciclista>> Todos(IDbTransaction transaction)
	{
		return transaction.QueryAsync<Ciclista>(
			@"select 
                ciclista_ra
            from ciclista
            order by ciclista_ra"
		);
	}
	public async Task<bool> Existe(int ra, IDbTransaction transaction)
	{
		return await transaction.QuerySingleAsync<bool>(
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
	public async Task<bool> EstaProibido(int ra, IDbTransaction transaction)
    {
        return await transaction.QuerySingleAsync<bool>(
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

}