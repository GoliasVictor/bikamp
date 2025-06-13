using System.Data;
using Bikamp;
using Bikamp.Controllers;
using Microsoft.AspNetCore.Http.HttpResults;
using Api = Bikamp;

namespace Test.Controllers;

[Collection("Sequential")]
public class PenalidadesControllerTest : IDisposable
{
    BDManager bd;
    PenalidaesController controller;

    List<PenalidaesController.Penalidade> penalidades = [
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
    List<Emprestimo> _emprestimos = [
        new(1, new(2013, 12, 1), new(2013, 12, 1, 2, 0, 0), 4, 4, 0),
        new(1, new(2022, 1, 12, 12, 34, 01), new(2022, 1, 13, 12, 22, 59), 2, 3, 1),
        new(2, new(2024, 06, 5), null, 1, null, 12),
        new(1, new(2025, 03, 9, 20, 40, 5), new(2025, 06, 9, 10, 20, 22), 1, 2, 58),
        new(222222, new(2025, 04, 01, 21, 14, 09), new(2025, 04, 1, 23, 20, 22), 1, 2, 12)
    ];
    public PenalidadesControllerTest()
    {
        List<Mantenedor> mantenedores = [
            new(1, (int) CargoId.Supervisor, "Arnaldo", "99999"),
            new(2, (int) CargoId.Reparador, "Bernaldo", "11111"),
            new(3, (int) CargoId.Administrador, "Cirnaldo", "22222"),
            new(4, (int) CargoId.Demitido, "Dornaldo", "33333")
        ];

        List<Ciclista> ciclistas = [
            new(1),
            new(2),
            new(222222),
        ];
        List<Bicicletario> bicicletarios = [
            new(1, -22.818126708834360, -47.072002654242010),
            new(2, -22.813764629988768, -47.064217957347750),
            new(3, -22.817115212576276, -47.069300949863376),
            new(4, -22.81478224016535, -47.07041111428769),
        ];
        List<Bicicleta> bicicletas = [
            new(0, 1),
            new(1, 1),
            new(12, 1),
            new(58, 1),
        ];



        bd = new BDManager();
        controller = new(bd.conn);
        bd.Resetar();
        bd.CarregarDados(
            mantenedores: [.. mantenedores],
            ciclistas: [.. ciclistas],
            bicicletarios: [.. bicicletarios],
            penalidades: [.. penalidades.Select(p => new Penalidade(
                p.penalidade_inicio,
                p.ciclista_ra,
                p.emprestimo_inicio,
                p.tipo_penalidade_id,
                p.penalidade_automatica,
                p.penalidade_fim,
                p.detalhes,
                p.mantenedor_id_aplicador!.Value ,
                p.mantenedor_id_perdoador,
                p.motivacao_perdao
            ))],
            emprestimos: [.. _emprestimos],
            bicicletas: [ ..bicicletas]
        );
    }

    public void Dispose() => bd.conn.Dispose();

    #region GET /penalidades

    [Fact]
    public async void GetAllSuccess()
    {
        var result = await controller.GetAll();
        Assert.IsType<OkObjectResult>(result.Result);
        var value = (IEnumerable<PenalidaesController.Penalidade>?)(((OkObjectResult?)result.Result)?.Value) ;
        Assert.NotNull(value);
        foreach (var p in penalidades)
            Assert.Contains(p, value);
    }

    #endregion

    #region POST /penalidades/manual - Classes de Equivalência

    [Theory]
    [InlineData(2014, 12, 13, 123456, 2014, 12, 12, 4, null, 3)]
    [InlineData(2022, 06, 20, 246810, 2021, 09, 03, 4, null, 1)]
    public async void Post_PenalidadeManualWithInvalidEndTime_ReturnsUnprocessableEntity(int penalidade_fim_ano, int penalidade_fim_mes, int penalidade_fim_dia, int ciclista_ra, int emprestimo_inicio_ano, int emprestimo_inicio_mes, int emprestimo_inicio_dia, int tipo_penalidade_id, string? detalhes, int mantenedor_id_aplicador)
    {
        DateTime penalidade_fim = new(penalidade_fim_ano, penalidade_fim_mes, penalidade_fim_dia);
        DateTime emprestimo_inicio = new(emprestimo_inicio_ano, emprestimo_inicio_mes, emprestimo_inicio_dia);

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, penalidade_fim, ciclista_ra, emprestimo_inicio, detalhes));

        Assert.IsType<UnprocessableEntityObjectResult>(result);
    }


    [Theory]
    [InlineData(1, 2014, 12, 12, 4, 25)] // Classe inválida: Aplicador 25
    [InlineData(2, 2021, 09, 03, 4, -1)] // Classe inválida: Aplicador -1
    public async void Post_PenalidadeManualWithNullCargoId_ReturnsConflict(int ciclista_ra, int emprestimo_inicio_ano, int emprestimo_inicio_mes, int emprestimo_inicio_dia, int tipo_penalidade_id, int mantenedor_id_aplicador)
    {
        DateTime emprestimo_inicio = new(emprestimo_inicio_ano, emprestimo_inicio_mes, emprestimo_inicio_dia);

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, null, ciclista_ra, emprestimo_inicio, null));

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Theory]
    [InlineData(1, 2014, 12, 12, 4, 2)] // Classe inválida: Aplicador com cargo = Reparador
    [InlineData(2, 2021, 09, 03, 4, 4)] // Classe inválida: Aplicador com cargo  = Demitido
    public async void Post_PenalidadeManualWithInvalidCargoId_ReturnsConflict(int ciclista_ra, int emprestimo_inicio_ano, int emprestimo_inicio_mes, int emprestimo_inicio_dia, int tipo_penalidade_id, int mantenedor_id_aplicador)
    {
        DateTime emprestimo_inicio = new(emprestimo_inicio_ano, emprestimo_inicio_mes, emprestimo_inicio_dia);

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, null, ciclista_ra, emprestimo_inicio, null));

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Theory]
    [InlineData(1, 2013, 12, 1, -1, 3)] // Classe inválida: Tipo -1
    [InlineData(1, 2022, 1, 12, 999, 1)] // Classe inválida: Tipo 999
    [InlineData(2, 2025, 03, 9, 0, 1)] // Classe inválida: Tipo 0
    public async void Post_PenalidadeManualWithNonexistentEmprestimo_ReturnsConflict(int ciclista_ra, int emprestimo_inicio_ano, int emprestimo_inicio_mes, int emprestimo_inicio_dia, int tipo_penalidade_id, int mantenedor_id_aplicador)
    {
        DateTime emprestimo_inicio = new(emprestimo_inicio_ano, emprestimo_inicio_mes, emprestimo_inicio_dia);

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, null, ciclista_ra, emprestimo_inicio, null));

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Theory]
    [InlineData(0, 1, 3)]
    [InlineData(1, 2, 1)] 
    [InlineData(3, 3, 1)] 
    public async void Post_ValidPenalidadeManual(int idx_emprestimo, int tipo_penalidade_id, int mantenedor_id_aplicador)
    {
        DateTime emprestimo_inicio = _emprestimos[idx_emprestimo].emprestimo_inicio;
        int ciclista_ra = _emprestimos[idx_emprestimo].ciclista_ra;

        var result = await controller.Post(new PenalidaesController.NovaPenalidadeManual(mantenedor_id_aplicador, tipo_penalidade_id, null, ciclista_ra, emprestimo_inicio, null));

        Assert.IsType<OkResult>(result);
    }

    #endregion
}