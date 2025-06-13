using System.Data;
using System.Runtime.InteropServices;
using Bikamp.Controllers;
using Microsoft.AspNetCore.Routing.Constraints;
using Api = Bikamp ;

namespace Test.Controllers;

record AlunoInfo (int cartao, bool regular);
class DacDummy(Dictionary<int, AlunoInfo> alunos) : Api.Dac
{
    Dictionary<int, AlunoInfo> _alunos = alunos;
    override public bool EhAlunoRegulamenteMatriculado(int ra)
    {
        return _alunos.Any((kv) => kv.Key == ra && kv.Value.regular);
    }

    override public int? ObterRaAlunoCartao(int cartao)
    {
        return _alunos.Cast<KeyValuePair<int, AlunoInfo>?>()
                      .FirstOrDefault((kv) => kv?.Value.cartao == cartao, null)?.
                      Key;

    }

}
[Collection("Sequential")]
public class ApiBicicletarioControllerTest : IDisposable
{
    BDManager bd;
    ApiBicicletarioController controller;
    public ApiBicicletarioControllerTest()
    {

        bd = new BDManager();

        controller = new ApiBicicletarioController(
            bd.conn,
            new DacDummy(new(){
                {285258, new AlunoInfo(300, true) }, // Aluno com tudo certo 
                {253793, new AlunoInfo(400, true) }, // Aluno com penalidade faltando 1 dia
                {167846, new AlunoInfo(200, true) }, // Aluno com penalidade permanente
                {193542, new AlunoInfo(100, false) }, // Aluno não regularmente matriculado 
            }),
            new Api.Repositories.BicicletarioRepository(),
            new Api.Repositories.CiclistaRepository()
        );
        bd.Resetar();
        var now = DateTime.Now;
        var emprestimo1Start = now.AddDays(-5);
        var emprestimo1End = now.AddDays(-5);
        var emprestimo1PenalidadeStart = now.AddDays(-4);
        var emprestimo1PenalidadeFim = now.AddDays(-3);

        var emprestimo2Start           = now.AddDays(-1);
        var emprestimo2End             = now.AddHours(-12);
        var emprestimo2PenalidadeStart = now.AddHours(-6);
        var emprestimo2PenalidadeFim   = now.AddDays(1);

        var emprestimo3Start = now.AddDays(-6);
        var emprestimo3PenalidadeStart = now.AddDays(-1);

        bd.CarregarDados(
            bicicletarios: [
                new(1, -22.818126708834360, -47.072002654242010), // Bicicletario com nenhuma bicicleta disponivel
                new(2, -22.813764629988768, -47.064217957347750), // Bicicletario com 1 bicicleta disponivel
                new(3, -22.817115212576276, -47.069300949863376), // Bicicletario com 2 bicicletas disponiveis
            ],
            ciclistas: [
                new(285258),
                new(253793),
                new(167846)
            ],
            mantenedores: [
                new(1, 1, "alfredo", "saasas")
            ],
            emprestimos: [
                new(285258, emprestimo1Start, emprestimo1End, 3, 2   , 1),
                new(253793, emprestimo2Start, emprestimo2End, 2, 3   , 2),
                new(167846, emprestimo3Start, null          , 1, null, 3),
            ],
            penalidades: [
                new(emprestimo1PenalidadeStart, 285258 , emprestimo1Start, 1, true , emprestimo1PenalidadeFim, null, 1, null, null),
                new(emprestimo2PenalidadeStart, 253793 , emprestimo2Start, 1, true , emprestimo2PenalidadeFim, null, 1, null, null),
                new(emprestimo3PenalidadeStart, 167846 , emprestimo3Start, 2, false, null                    , null, 1, null, null)
            ],
            bicicletas: [
                new(1, 1),
                new(2, 1),
                new(3, 1),
                new(5, 2),
                new(6, 3),
                new(7, 4),


            ],
            pontos: [
                new(1, 1, 1, null),
                new(2, 1, 1, null),
                new(3, 1, 1, null),
                new(4, 1, 1, null),


                new(1, 2, 1, 1),
                new(2, 2, 1, null),
                new(3, 2, 1, null),
                new(4, 2, 1, null),

                new(1, 3, 1, 2),
                new(2, 3, 1, 3),
                new(3, 3, 1, null),
                new(4, 3, 1, null),
            ]
        );
    }

    public void Dispose()
    {
        bd.conn.Dispose();
    }
    const int ID_LIBERADO = 1;
    [Theory()]
    [InlineData(2)]
    [InlineData(3)]
    public async void PostEmprestimosSucess(int bicicletario_id)
    {
        var cartoa_ciclista = 300;
        var request = new ApiBicicletarioController.RequesicaoEmprestimo(bicicletario_id, cartoa_ciclista);
        var result = (await controller.PostEmprestimos(request)).Result;

        Assert.IsType<OkObjectResult>(result);
        var ok = result as OkObjectResult;
        var value = ok?.Value as ApiBicicletarioController.RespostaSolicitacaoEmprestimo;
        Assert.Equal(ID_LIBERADO, (int?)value?.status);
    }

    [Theory()]
    [InlineData(300, 1)] // # bicicletas disponivels < 1
    [InlineData(100, 2)] // Cartão valido == False
    [InlineData(200, 2)] // Possui Penalidade Permanente == True
    [InlineData(400, 2)] // Fim penalidade mais tarde > Agora
    public async void PostEmprestimosInvalid(int cartao, int bicicletario_id)
    {
        var request = new ApiBicicletarioController.RequesicaoEmprestimo(bicicletario_id, cartao);
        var result = (await controller.PostEmprestimos(request)).Result;

        Assert.IsAssignableFrom<ObjectResult>(result);
        var obj = result as ObjectResult;
        var value = obj?.Value as ApiBicicletarioController.RespostaSolicitacaoEmprestimo;
        Assert.NotEqual(ID_LIBERADO, (int?)value?.status);
    }
    
 
}