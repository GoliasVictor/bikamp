using Microsoft.Extensions.Configuration;
public static class Config
{
    static Config()
    {
        var AppSettingsJsonPath = Environment.GetEnvironmentVariable("APP_SETTINGS_JSON_PATH");

        if (AppSettingsJsonPath is null)
        {
            Console.WriteLine("Arquvio de configuração appsettings.json não definido, sera usado ./appsettings.json por padrão");
            AppSettingsJsonPath = "./appsettings.json";
        }
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .AddJsonFile(AppSettingsJsonPath)
            .Build();
        UrlApi = config["UrlApi"] ;
        if (UrlApi != null)
        {
            ConnectionStringMySQL = config["ConnectionStringMySQL"] ?? throw new Exception("Defina um valor de ConnectionStringMySQL nas configurações");
        }
    }

    public static readonly string? UrlApi;
    public static readonly string? ConnectionStringMySQL;


}