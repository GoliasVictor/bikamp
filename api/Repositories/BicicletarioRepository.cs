using System.Runtime.CompilerServices;

namespace Bikamp.Repositories;

public class BicicletarioRepository()
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
	public async Task<bool> Existe(int bicicletario_id, IDbTransaction transaction)
	{
        var count_bicicletario = await transaction.QuerySingleAsync<int>("SELECT count(*) as count FROM bicicletario WHERE bicicletario_id = @bicicletario;",
            new { bicicletario = bicicletario_id });

        return count_bicicletario > 0;
	}

    public async Task<List<(int, int)>> GetPontosPossiveis(int bicicletario_id, IDbTransaction transaction) {
        return (await transaction.QueryAsync<(int, int)>(
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
                bicicletario_id = bicicletario_id
            }
        )).ToList();
    }


}