#!/usr/bin/env bash
set -euo pipefail

until pg_isready -h postgres-database -p 5432 -U postgres
do
  sleep 2
done

echo "Running Database Migrations"
alembic upgrade head

echo "Environment: compose = ${compose:-}"

if [ ${compose:-} = "true" ]; then
    echo "Starting FastAPI Production Server"
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
else
    echo "Starting FastAPI Development Server"
    uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
fi
