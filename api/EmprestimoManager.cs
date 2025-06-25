namespace Bikamp;

public static class EmprestimoManager
{
    public static async Task FecharEmprestimo(
        IDbTransaction tran,
        int ciclista_ra,
        DateTime emprestimo_inicio,
        int? bicicletario_id
    )
    {
        var duration = DateTime.Now - emprestimo_inicio;
        if (duration.TotalMinutes > MINUTOS_TEMPO_MAXIMO_EMPRESTIMO)
        {
            DateTime? penalidade_fim = DateTime.Now.AddDays(DIAS_DURACAO_PENALIDADE_ATRASO);
            int next_id = await tran.QuerySingleAsync<int>(
                @"SELECT COALESCE(MAX(penalidade_id), 0) + 1 FROM penalidade"
            );

            var res = await tran.ExecuteAsync(
                @"insert into penalidade (penalidade_id, penalidade_inicio, ciclista_ra, emprestimo_inicio, tipo_penalidade_id, penalidade_automatica, penalidade_fim) 
                value (@penalidade_id, now(), @ciclista_ra, @emprestimo_inicio, @ID_TIPO_PENALIDADE_ATRASO, true, @penalidade_fim)",
                new
                {
                    penalidade_id = next_id,
                    ID_TIPO_PENALIDADE_ATRASO = ID_TIPO_PENALIDADE_ATRASO,
                    ciclista_ra,
                    emprestimo_inicio,
                    penalidade_fim
                }
            );
            Console.WriteLine($"Resultado da inserção de penalidade: {res}");
        }
        await tran.ExecuteAsync(
            @"update emprestimo 
            set emprestimo_fim = now(),
                bicicletario_id_devolvido = @bicicletario_id_devolvido  
            where ciclista_ra = @ciclista_ra and  emprestimo_inicio = @emprestimo_inicio;",
            new
            {
                bicicletario_id_devolvido = bicicletario_id,
                ciclista_ra,
                emprestimo_inicio
            }
        );
    }
}