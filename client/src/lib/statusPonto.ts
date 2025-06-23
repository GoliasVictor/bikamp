
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
export class StatusPonto {
                                                  	private status: StatusPontoEnum;

	constructor(status: StatusPontoEnum) {
		this.status = status;
	}


	toString(): string {
		const statusString = StringStatusPonto.find(([status]) => status === this.status);
		return statusString ? statusString[1] : "Desconhecido";
	}
	static allStatuses(): [StatusPontoEnum, string][] {
		return StringStatusPonto;
	}
}