FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source/
COPY bikamp.sln bikamp.sln
COPY test/test.csproj test/test.csproj
COPY api/api.csproj api/api.csproj
RUN dotnet restore 
COPY . .
RUN dotnet build --no-restore 
CMD ["dotnet", "test", "--no-build"]