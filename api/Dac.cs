namespace Bikamp;
public class Dac {
    public bool EhAlunoRegulamenteMatriculado(int ra){
        return ra % 3 == 0;
    }

    public int? ObterRaAlunoCartao(int ra){
        if(ra  < 0 ){
            return null;
        }
        if(ra  == 9999999){
            return 3;
        }
        return null;

    }
}