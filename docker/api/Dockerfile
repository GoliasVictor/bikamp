FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source/api
COPY api/api.csproj .
RUN dotnet restore 
COPY api /source/api
RUN dotnet build --no-restore

FROM build AS publish
RUN	dotnet publish api.csproj -o /app/publish
COPY docker/api/appsettings.json /app/publish/appsettings.json

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "api.dll", "--environment", "Development"]