using System.Data;
using Bikamp.Controllers;
using Api = Bikamp ;
using Bikamp;

namespace Test.Controllers;
public class PardonControllerTest : IDisposable 
{
    BDManager bd;
    PardonController controller;
    public PardonControllerTest(){

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
        var date = new DateTime(2025, 4, 7);
        
        var expected = new PardonRequest(ra,  date, "DESCURPE");

        await controller.Post(new(ra,  date, "DESCURPE"));
  
        var actual = bd.Get(new PardonRequest.PK(ra, date));
        Assert.Equal(expected, actual);
    }
}