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
                        mantenedor_id_aplicador: null,
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
}