#!/usr/bin/env bash
set -euo pipefail

if [ "${RUN_CONTEXT:-}" = "devcontainer" ] && command -v git >/dev/null 2>&1
then
  git config --global --add safe.directory /workspace
fi


echo "Running Database Migrations"
alembic upgrade head

echo "Environment: RUN_CONTEXT = ${RUN_CONTEXT:-}"

if [ "${RUN_CONTEXT:-}" = "docker-compose" ]
then
    echo "Starting Uvicorn Production Server"
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
fi

if [ "${RUN_CONTEXT:-}" = "devcontainer" ]
then
    echo "Starting FastAPI Development Server"
    uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
fi

echo "Unsupported RUN_CONTEXT='${RUN_CONTEXT:-}'. Expected 'docker-compose' or 'devcontainer'."
exit 1