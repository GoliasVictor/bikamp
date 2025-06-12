using System.Data;
using Bikamp.Controllers;
using Microsoft.AspNetCore.Mvc;
using Api = Bikamp;

namespace Test.Controllers;

[Collection("Sequential")]
public class MantenedoresControllerTest : IDisposable 
{
    BDManager bd;
    MantenedoresController controller;
    
    public MantenedoresControllerTest()
    {
        bd = new BDManager();
        controller = new MantenedoresController(bd.conn);
        bd.Resetar();
        bd.CarregarDados(
            mantenedores: [
                new(1, 1, "carlos", "8888"),
                new(2, 1, "joão", "8888")
            ]
        );
    }

    public void Dispose()
    {
        bd.conn.Dispose();
    }

    #region GET /mantenedores/{id} - Classes de Equivalência

    [Theory]
    [InlineData(1)] // Classe válida: ID existente
    [InlineData(2)] // Classe válida: ID existente
    public async void Get_ValidExistingId_ReturnsMantenedor(int id)
    {
        var result = await controller.Get(id);
        
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var mantenedor = Assert.IsType<Mantenedor>(okResult.Value);
        Assert.Equal(id, mantenedor.mantenedor_id);
    }

    [Theory]
    [InlineData(999)]  // Classe inválida: ID não existente
    [InlineData(-1)]   // Classe inválida: ID negativo
    [InlineData(0)]    // Classe inválida: ID zero
    public async void Get_InvalidId_ReturnsNotFound(int id)
    {
        var result = await controller.Get(id);
        
        Assert.IsType<NotFoundResult>(result.Result);
    }

    #endregion

    #region GET /mantenedores/{id} - Análise de Valor Limite

    [Theory]
    [InlineData(int.MinValue)] // Valor limite: mínimo inteiro
    [InlineData(int.MaxValue)] // Valor limite: máximo inteiro
    public async void Get_BoundaryValues_ReturnsNotFound(int id)
    {
        var result = await controller.Get(id);
        
        Assert.IsType<NotFoundResult>(result.Result);
    }

    #endregion

    #region POST /mantenedores - Classes de Equivalência

    [Fact]
    public async void Post_ValidMantenedor_Success()
    {
        var id = 4;
        var expected = new Mantenedor(id, 1, "alfredo", "8888");

        var result = await controller.Post(new(id, (Api.CargoId)1, "alfredo", "8888"));
  
        Assert.IsType<OkResult>(result);
        var actual = bd.Get(new Mantenedor.PK(id));
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(5, 1, "maria", "senha123")]     // Classe válida: cargo 1
    [InlineData(6, 2, "jose", "12345")]        // Classe válida: cargo 2
    public async void Post_ValidMantenedorWithDifferentCargos_Success(int id, int cargoId, string nome, string senha)
    {
    
        var mantenedor = new Mantenedor(id, cargoId, nome, senha);

    
        var result = await controller.Post(new Bikamp.Mantenedor(id, cargoId, nome, senha));
    
        Assert.IsType<OkResult>(result);
        var actual = bd.Get(new Mantenedor.PK(id));
        Assert.Equal(mantenedor, actual);
    }

    [Theory]
    [InlineData(7, 999, "nome", "senha")]      // Classe inválida: cargo inexistente
    [InlineData(8, -1, "nome", "senha")]       // Classe inválida: cargo negativo
    [InlineData(9, 0, "nome", "senha")]        // Classe inválida: cargo zero
    public async void Post_InvalidCargo_ReturnsUnprocessableEntity(int id, int cargoId, string nome, string senha)
    {
    
        var mantenedor = new Bikamp.Mantenedor(id, cargoId, nome, senha);
        var result = await controller.Post(mantenedor);
    
        Assert.IsType<UnprocessableEntityResult>(result);
    }

    #endregion

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public async void PatchSuccess(int id)
    {
        var expected = bd.Get(new Mantenedor.PK(id))!;
        expected = expected with { nome = "carlitos" };

        await controller.Patch(new(id, "carlitos", null, null));
        
        var actual = bd.Get(new Mantenedor.PK(id));
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async void NotFound()
    {
        var id = 234;

        var result = await controller.Patch(new(id, "carlitos", null, null));

        Assert.IsType<NotFoundResult>(result);
    }

}