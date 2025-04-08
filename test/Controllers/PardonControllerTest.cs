using System.Data;
using Bikamp.Controllers;
using Api = Bikamp ;

namespace Test.Controllers;
public class PardonControllerTest : IDisposable 
{
    BDManager bd;
    PardonController controller;
    public MantenedoresControllerTest(){

        bd = new BDManager();
        controller = new PardonController(bd.conn);
        bd.Resetar();
    }

    public void Dispose(){
        bd.conn.Dispose();
    }
    
    [Fact]
    public async void PostSucess()
    {
        var ra = 1;
        var date = DateTime.Now();
        
        var expected = new PardonRequest(ra,  date, "DESCURPE");

        await controller.Post(new(ra,  date, "DESCURPE"));
  
        var actual = bd.Get(new SolicitacaoPerdao.PK(ra, date));
        Assert.Equal(expected, actual);
    }
        
    [Fact]
    public async Task GetAll_ReturnsAllPardonRequests()
    {
    
        var p1 = new PardonRequest(123, new DateTime(2025, 4, 7, 10, 0, 0), "justificativa 1");
        var p2 = new PardonRequest(456, new DateTime(2025, 4, 7, 11, 0, 0), "justificativa 2");

        await bd.InsertAsync(p1); 
        await bd.InsertAsync(p2);

        var result = await controller.GetAll();
        var list = result.ToList();

        Assert.Contains(p1, list);
        Assert.Contains(p2, list);
        Assert.True(list.Count >= 2); 
    }
}