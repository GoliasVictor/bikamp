using Microsoft.Extensions.Configuration;
using System.Text;

namespace Test;

public static class Configuracao
{
    static Configuracao()
    {
        var AppSettingsJsonPath = Environment.GetEnvironmentVariable("BIKAMP_TEST_PATH_APP_SETTINGS_JSON");
        AppSettingsJsonPath ??= "./appsettings.json";
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .AddJsonFile(AppSettingsJsonPath)
            .Build();
        StrConexaoMySQL = config["MySqlConnection"]
                            ?? Environment.GetEnvironmentVariable("BIKAMP_TEST_MYSQL_CONNECTION")
                            ?? throw new Exception("Defina a variavel de ambiente MYSQL_CONNECTION");
    }

    public static readonly string? StrConexaoMySQL;
}