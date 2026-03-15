#!/usr/bin/env bash
set -euo pipefail

echo "Running Database Migrations"
uv run alembic upgrade head

echo "Starting FastAPI Development Server"
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000

# echo "Starting FastAPI Production Server"
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000