## Start-up Project
The project is configured to use devcontainers, please open in VSCode or PyCharm.

### Test Application Code using DevContainers
Command to start the application. 
```bash
uv run fastapi dev --host 0.0.0.0 --port 8000
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
This command should be used for development and run inside the container which using devcontainers.

### Build Docker Image
```bash
docker build -t fastapi-backend:0.0.1 .
```
or
```bash
docker buildx bake
```

### Run the application
```bash
docker run -p 8000:8000 fastapi-backend:0.0.1
```

### Alembic
Initial set-up
- Update `alembic.ini` with `sqlalchemy.url`
- Update `alembic/env.py` with `target_metadata = SQLModel.metadata`

```bash
# Generate Migrations
alembic revision --autogenerate -m "creates purchase table"

# Apply Migrations
alembic upgrade head
```

### Verify in Postgres Database
```bash
docker exec -it start-up_devcontainer-postgres-database-1 psql -U postgres
# alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000

SELECT * FROM purchase;
```

