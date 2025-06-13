namespace Bikamp;
public class Dac {
    virtual public bool EhAlunoRegulamenteMatriculado(int ra){
        return ra % 3 == 0;
    }

    virtual public int? ObterRaAlunoCartao(int ra){
        if(ra  < 0 ){
            return null;
        }
        if(ra  == 9999999){
            return 3;
        }
        return null;

    }
}