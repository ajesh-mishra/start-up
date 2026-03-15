

### Command to start the Postgres DB

```bash
docker compose -f '.devcontainer/docker-compose.yml' up -d --build 'postgres-database'
```

### Start the Postgres CLI

```bash
docker ps
docker exec -it 454586e3193b psql -U postgres
```

### Command to stop Postgres Database

```bash
docker compose -f .devcontainer/docker-compose.yml down postgres-database
```

