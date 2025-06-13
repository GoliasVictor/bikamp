using System.Data;
using Bikamp.Controllers;
using Api = Bikamp;

namespace Test.Controllers;

[Collection("Sequential")]
public class PenalidadesControllerTest : IDisposable
{
    BDManager bd;
    PenalidaesController controller;

    List<Penalidade> penalidades = [
                    new(
                        penalidade_inicio: new DateTime(2025, 04, 02, 22, 14, 09),
                        penalidade_fim: null,
                        ciclista_ra: 222222,
                        emprestimo_inicio: new DateTime(2025, 04, 01, 21, 14, 09),
                        tipo_penalidade_id: 4,
                        detalhes: null,
                        mantenedor_id_aplicador: 1,
                        mantenedor_id_perdoador: null,
                        penalidade_automatica: true,
                        motivacao_perdao: null
                    )
                ];

    public PenalidadesControllerTest()
    {
        bd = new BDManager();
        controller = new(bd.conn);
        bd.Resetar();
        bd.CarregarDados(
            penalidades: [.. penalidades]
        );
    }

    public void Dispose() => bd.conn.Dispose();

    #region GET /penalidades

    [Fact]
    public async void GetAllSuccess()
    {
        var result = await controller.GetAll();

        Assert.Equal(penalidades.ToString(), result.Value?.ToString());
    }

    #endregion

    #region POST /penalidades/manual - Classes de Equivalência

    [Theory]
    [InlineData(2014, 12, 13, 123456, 2014, 12, 12, 4, null, 3)]
    [InlineData(2022, 06, 20, 123456, 2021, 09, 03, 4, null, 1)]
    public async void Post_PenalidadeManualWithInvalidEndTime_ReturnsUnprocessableEntity(int penalidade_fim_ano, int penalidade_fim_mes, int penalidade_fim_dia, int ciclista_ra, int emprestimo_inicio_ano, int emprestimo_inicio_mes, int emprestimo_inicio_dia, int tipo_penalidade_id, string? detalhes, int mantenedor_id_aplicador)
    {
        DateTime penalidade_fim = new(penalidade_fim_ano, penalidade_fim_dia, penalidade_fim_mes);
        DateTime emprestimo_inicio = new(emprestimo_inicio_ano, emprestimo_inicio_dia, emprestimo_inicio_mes);

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, penalidade_fim, ciclista_ra, emprestimo_inicio, detalhes));

        Assert.IsType<UnprocessableEntityResult>(result);
    }





    #endregion
}