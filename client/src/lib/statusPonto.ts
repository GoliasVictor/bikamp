
export enum StatusPontoEnum {
	Online = 1,
	Offline = 2,
	Manutencao = 3,
	Removido = 4
}

let StringStatusPonto: [StatusPontoEnum, string][] = [
	[StatusPontoEnum.Online, "Online"],
	[StatusPontoEnum.Offline, "Offline"],
	[StatusPontoEnum.Manutencao, "Em manutencao"],
	[StatusPontoEnum.Removido, "Removido"],
]

function toString(status : any): string {
		const statusString = StringStatusPonto.find(([cdStatus]) => cdStatus === status);
		return statusString ? statusString[1] : "Desconhecido";
	}
function all(): [StatusPontoEnum, string][] {
		return StringStatusPonto;
}

export default {
  StatusPontoEnum, 
  toString,
  all
}