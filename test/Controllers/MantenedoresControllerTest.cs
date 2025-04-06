using System.Data;
using Bikamp.Controllers;
using Api = Bikamp ;

namespace Test.Controllers;
public class MantenedoresControllerTest : IDisposable 
{
    BDManager bd;
    MantenedoresController controller;
    public MantenedoresControllerTest(){

        bd = new BDManager();
        controller = new MantenedoresController(bd.conn);
        bd.Resetar();
        bd.CarregarDados(
            mantenedores: [
                new(1, 1, "carlos"),
                new(2, 1, "joão")
            ]
        );
    }

    public void Dispose(){
        bd.conn.Dispose();
    }
    
    [Fact]
    public async void PostSucess()
    {
        var id = 4;
        var expected = new Mantenedor(id, 1, "alfredo");

        await controller.Post(new(id, (Api::CargoId)1, "alfredo"));
  
        var actual = bd.Get(new Mantenedor.PK(id));
        Assert.Equal(expected, actual);
    }
    
    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public async void PatchSucess(int id)
    {
        var expected = bd.Get(new Mantenedor.PK(id))!;
        expected = expected with { nome  = "carlitos" };

        await controller.Patch(new(id, "carlitos", null));
        
        var actual = bd.Get(new Mantenedor.PK(id));
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async void NotFound()
    {
        var id = 234;

        var result = await controller.Patch(new(id, "carlitos", null));

        Assert.IsType<NotFoundResult>(result);
    }
}