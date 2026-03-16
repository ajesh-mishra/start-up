#!/usr/bin/env bash
set -euo pipefail

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