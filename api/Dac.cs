namespace Bikamp;

public record AlunoInfo (int cartao, bool regular);
public class Dac {
    
    Dictionary<int, AlunoInfo> _alunos = [];
    public Dac(){}
    public Dac(Dictionary<int, AlunoInfo> alunos)
    {
        _alunos = alunos;
    }
    virtual public bool EhAlunoRegulamenteMatriculado(int ra)
    {
        return _alunos.Any((kv) => kv.Key == ra && kv.Value.regular);
    }

    virtual public int? ObterRaAlunoCartao(int cartao) {
        return _alunos.Cast<KeyValuePair<int, AlunoInfo>?>()
                      .FirstOrDefault((kv) => kv?.Value.cartao == cartao, null)?.
                      Key;

    }
}