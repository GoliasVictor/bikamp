FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source/api
COPY api/api.csproj .
RUN dotnet restore 
COPY api /source/api
RUN dotnet build --no-restore

FROM build AS publish
RUN	dotnet publish api.csproj -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
RUN apt-get update \
    && apt-get install -y curl
WORKDIR /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .	
CMD ["dotnet", "api.dll", "--environment", "Development"]