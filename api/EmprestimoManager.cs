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
                bicicletario_id_devolvido = bicicletario_id,
                ciclista_ra,
                emprestimo_inicio
            }
        );
    }
}