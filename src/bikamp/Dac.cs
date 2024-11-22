using System.Text.Json;

namespace Bikamp;

public record Aluno(int ra, int cartao);
public class DadosDac {

    public Aluno[] alunos { get; set; } = [];
}
public class Dac {
    DadosDac dados;

    public Dac()
    {
        dados = JsonSerializer.Deserialize<DadosDac>(File.ReadAllText("dac.json")) 
            ?? throw new Exception("Não foi possivel ler arquivo dac.json");
        Console.WriteLine(JsonSerializer.Serialize<DadosDac>(dados));
    }


    public int? ObterRaAlunoCartao(int cartao){

        return dados.alunos
            .Where(a => a.cartao == cartao)
            .FirstOrDefault()?
            .ra;

    }
}