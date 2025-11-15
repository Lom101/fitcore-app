# Dockerfile в fitcore-backend/
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Копируем проект и solution, находящиеся в текущей папке
COPY *.sln ./
COPY *.csproj ./

RUN dotnet restore

COPY . .

RUN dotnet publish fitcore-backend.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "fitcore-backend.dll"]
