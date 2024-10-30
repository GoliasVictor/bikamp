using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace test;



public class Bicicletarios : ApiBaseTest
{
    [Fact]
    public async void PontosDisponiveis()
    {

        var response = await client.GetFromJsonAsync<List<PontosDisponiveis>>("/bicicletario/2/pontos-disponiveis");
 
    }
}