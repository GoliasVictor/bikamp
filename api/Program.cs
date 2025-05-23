using Bikamp;
using Bikamp.Repositories;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
     {
         options.AddPolicy("AllowAll",
             builder =>
             {
                 builder
                 .AllowAnyOrigin() 
                 .AllowAnyMethod()
                 .AllowAnyHeader();
             });
     });
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

builder.Services.AddScoped<IDbConnection>(_ =>
{
    IDbConnection conn = new MySqlConnection(builder.Configuration.GetConnectionString("Default"));
    conn.Open();
    return conn;
});
builder.Services.AddScoped<BicicletarioRepository>();
builder.Services.AddScoped<CiclistaRepository>();
builder.Services.AddScoped(_ =>  new Dac());


var app = builder.Build();

app.MapHealthChecks("/healthz");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
