# Docker - Construção e Execução de Container para API + PostgreSQL

## 🐘 Banco de Dados PostgreSQL

### Construir a imagem do PostgreSQL
  Observação: O ponto (.) no final do comando é essencial, pois indica que o Dockerfile está no diretório atual.
```bash
docker build -t postgres .
```

### Executar o container com relacionando a imagem do postgres

```bash
docker run --name cont-postgresql \
  -e POSTGRES_PASSWORD=DSM@123 \
  -p 5432:5432 \
  -d postgres
```

- API

## 📦 Construir a Imagem Docker API

```bash
docker build -t img-api .
```

## 🚀 Executar o Container da API e colocar as variaveis

```bash
docker run --name cont-api \
  -p 5200:3000 \
  -e POSTGRES_HOST=host.docker.internal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=DSM@123 \
  -e POSTGRES_DB=usersdb \
  -e POSTGRES_PORT=5432 \
  -d img-api
```

## 🔍 Verificar o Banco de Dados
Para verificar as tabelas no PostgreSQL:

```bash
docker exec -it cont-postgresql psql -U postgres
```

## 🌐 Imagem no Docker Hub
A imagem está disponível em:
https://hub.docker.com/repository/docker/nicolaskn95/3011392423037-api-users/general
