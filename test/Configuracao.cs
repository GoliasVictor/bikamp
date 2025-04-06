using Microsoft.Extensions.Configuration;
using System.Text;

namespace Test;

public static class Configuracao
{
    static Configuracao()
    {
        StrConexaoMySQL = Environment.GetEnvironmentVariable("MYSQL_CONNECTION") ?? throw new Exception("Defina a variavel de ambiente MYSQL_CONNECTION");
    }

    public static readonly string? StrConexaoMySQL;
}