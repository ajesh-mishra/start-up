## Start-up FastApi Backend
The project is configured to use devcontainers, please open in VSCode or PyCharm.
- This is a FastApi backend
- Uses Alembic for migrations


### Command to start backend. 
```bash
uv run fastapi dev --host 0.0.0.0 --port 8000
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```


## Alembic
Initial set-up
- Create `.env` from `.env.example` and set `DATABASE_URL`
- Update `alembic/env.py` with `target_metadata = SQLModel.metadata`

```bash
# Generate Migrations
alembic revision --autogenerate -m "initial schema"

# Apply Migrations
alembic upgrade head
```


## Verify in Postgres Database
```bash
docker exec -it start-up-fastapi-backend-1 psql -U postgres
docker exec -it start-up-postgres-database-1 psql -U postgres

SELECT * FROM purchase;
```

