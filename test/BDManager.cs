using Microsoft.Extensions.Logging;
using System.Data;

namespace Test;

class BDManager 
{
    public IDbConnection conn;

    public BDManager() : this(BDManager.CriarConexao()){ }
    public BDManager(IDbConnection conn){
        this.conn = conn;
    }
    
    public static IDbConnection CriarConexao()
    {
        IDbConnection conn = new MySqlConnection(Configuracao.StrConexaoMySQL);
        conn.Open();
        return conn;
    }
    
    public string InsertFromType<T>(){
        System.Type t = typeof(T);
        string name = t.Name;
        List<string> columns = t.GetProperties().Select(f => f.Name).ToList() ;

        return @$"INSERT INTO {name.ToLower()}({String.Join(", ", columns)})
            VALUE ({String.Join(", ", columns.Select(f => '@'+f))})";
    }

    public void Insert<T>(params T[] values){
        conn.Execute(InsertFromType<T>(), values);
    }

    public T[] GetAll<T>(){
        System.Type t = typeof(T);
        string name = t.Name.ToLower();        

        return conn.Query<T>(@$"SELECT * FROM {name}").ToArray();
    }
    public T? Get<T>(IPrimaryKey<T> value)
        where T : Tabela
    {
        var values = GetAll<T>();
        return Array.Find(values, (v) => v.getPk().Equals(value));
    }


    public void Resetar() {
        conn.Execute(
            @"DELETE FROM penalidade;
            DELETE FROM emprestimo;
            DELETE FROM ponto;
            DELETE FROM bicicleta;
            DELETE FROM bicicletario;
            DELETE FROM pardon_request; 
            DELETE FROM ciclista;
            DELETE FROM mantenedor;"
        );
    }

    public void CarregarDados(    
        Mantenedor[]? mantenedores = default,
        Ciclista[]? ciclistas = default,
        Bicicletario[]? bicicletarios = default,
        Bicicleta[]? bicicletas = default,
        Ponto[]? pontos = default,
        Emprestimo[]? emprestimos = default,
        Penalidade[]? penalidades = default
    ) {
        Insert(mantenedores ?? []);
        Insert(ciclistas ?? []);
        Insert(bicicletarios ?? []);
        Insert(bicicletas ?? []);
        Insert(pontos ?? []);
        Insert(emprestimos ?? []);
        Insert(penalidades ?? []);
    }



}