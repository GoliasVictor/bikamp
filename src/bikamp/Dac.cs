namespace Bikamp;
public record DadosAluno (string Nome);
public class Dac {
	public DadosAluno ObterAluno(int ra){
		if(ra  < 0 ){
			return null;
		}
		if(ra  == 9999999){
			return new DadosAluno("Carlos");
		}
		return null;

	}
}