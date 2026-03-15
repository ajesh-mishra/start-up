#!/usr/bin/env bash
set -euo pipefail

uv run alembic upgrade head
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000