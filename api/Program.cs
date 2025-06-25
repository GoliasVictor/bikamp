using Bikamp;
using Bikamp.Repositories;
using Scalar.AspNetCore;
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
builder.Services.AddSwaggerGen(options =>
{
    options.SupportNonNullableReferenceTypes();
});
builder.Services.AddHealthChecks();

builder.Services.AddScoped<IDbConnection>(_ =>
{
    IDbConnection conn = new MySqlConnection(builder.Configuration.GetConnectionString("Default"));
    conn.Open();
    return conn;
});
builder.Services.AddScoped<BicicletarioRepository>();
builder.Services.AddScoped<CiclistaRepository>();
builder.Services.AddScoped(_ =>  new Dac(new(){
    {285258, new AlunoInfo(1000, true) },
    {253793, new AlunoInfo(2000, true) },
    {167846, new AlunoInfo(3000, true) },
    {193542, new AlunoInfo(4000, false) },
    {243494, new AlunoInfo(5000, false) }, 
    {209653, new AlunoInfo(6000, false) }, 
}));


var app = builder.Build();

app.MapHealthChecks("/healthz");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapScalarApiReference(option =>
    {
        option.OpenApiRoutePattern = "/swagger/{documentName}/swagger.json";
        
    });
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
