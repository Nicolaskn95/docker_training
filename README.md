# Docker - Construção e Execução de Container para API + PostgreSQL

## 📦 Passo 1: Construir a Imagem Docker

```bash
docker build -t img-api .
```

## 🚀 Passo 2: Executar o Container da API

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

## 🔍 Passo 3: Verificar o Banco de Dados
Para verificar as tabelas no PostgreSQL:

```bash
docker exec -it cont-postgresql psql -U postgres
```

## 🌐 Imagem no Docker Hub
A imagem está disponível em:
https://hub.docker.com/repository/docker/nicolaskn95/3011392423037-api-users/general
