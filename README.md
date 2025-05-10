# Bikamp

Sistema de gerenciamento de bicicletas comunitárias no campus da UNICAMP.

# Integrantes

- Isael G. S. Faria **(234258)**
- José Victor Santana Barbosa **(245511)**
- Amanda Beatriz Cunha Teixeira **(200763)**
- Arathi Zanvettor Guedes **(194330)**

# Como executar 
## pré requisitos:
No fim de cada pré requisito está a versão que foi testado o uso de cada um dos pré requisitos, outras versões podem ser compativeis
Com docker:
- docker (27.3.1)

Normalmente:  
- Banco de Dados  
	- MySql (9.3.0)
- Api 
	- dotnet (v8.0.111): É nescessario ser alguma versão do dotnet 8
- Frontend
	- node.js (v22.11.0): É preciso de no minimo versão 20
## docker
Caso queira apenas executar a aplicação sem se preocupar com dependencia e conseguir usar o docker basta abrir o projeto e executar
```shell
docker compose up api client
```

Para caso queira apenas executar o servidor execute:
```shell
docker compose up api 
``` 
> :warning: **Atenção**: executar apenas up não reconstroi o projeto novamente so levanta ele novamente, sempre que modificar algo execute com a flag `--build`
### Banco de dados 
O banco de dadaos você pode levantar uma instancia qualquer do mysql e se conectar na API porém não é recomendado que faça isso, e ao inves disso use o docker para levantar o banco de dados, com o seguinte comando:
```
docker compose up db
``` 
Ele mantem guardado as informações entre ume execução e outra para apagar elas basta executar:
```
docker compose down -v db
``` 
Caso tenha editado uma tabela e precise reiniciar o banco de dados basta executar o down -v e depois levantar novamente o banco de dados, quando o banco de dados é levantado inicialmente ele executas os sqls iniciais automaticamente

## Normal

### Banco de dados 
Caso você não queira usar via docker, basta você ter alguma conexão com um banco de dados mysql, e então executar os seguintes scripts mysql no seu banco de dados em sequencia 

1. **db/startup.sql**: Este script cria as tabelas
2. **db/base.sql**: Este script adiciona as informações nas tabelas readonly 
3. **db/populate.sql** (opcional): Este adiciona informações iniciais basicas 

### Api
Primeiro de tudo é nescessario garantir que está instalado o sdk do .NET 8.
Caso você já tiver instalado você pode verificar se tem o sdk instalado executando
```bash
dotnet --list-sdks
```

Para executar a api é nescessario configurar as conexões dele com o banco de dados que ficam no arquivo `appsettings.json`.
Existe um modelo de como o arquivo deve ser em `api/appsettings.model.json`.
Então Copie o arquivo `api/appsettings.model.json` para `api/appsettings.json` e edite ele.
Caso esteja usando o banco de dados via docker, é de se esperar que não seja nescessario editar nada do arquivo, caso não esteja usando o banco de dados via docker, então é nescessario que edite o arquivo com as informações de conexão ao banco de dados. 

Após ter configurado o api basta executar o projeto na pasta `api`:
```
dotnet run
```
Vocé pode testar a api usando swagger no seguinte link: [http://localhost:5259/swagger/index.html](http://localhost:5259/swagger/index.html)
(a porta pode variar, olhe a saida do terminal para garantir que está abrindo a url certa)

## Frontend
Primeiro é nescessario especificar como frontend vai se conectar ao backend, para isso é preciso definir as variavel de ambiente `VITE_API_URL`, é possivel configurar isso usando o arquivo `client/.env`, basta copiar o arquivo de modelo `client/.env.model` para `/client/.env`, e modificar caso seja nescessario (caso tenha sido levantado a api com docker ou usado o appsettings padrão não é nescessario modificar nada). 

Então garanta que há o node instalado, pelo menos na versão 20. 

Tendo o node instalado na pasta `client` execute o seguinte comando que instalara todos os pacotes nescessarios para executar o projeto

```shell
npm install
```

Após isso basta executar 
```shell
npm run dev 
```
