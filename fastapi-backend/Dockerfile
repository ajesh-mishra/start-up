# --- Stage 1: Build Stage ---
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /workspace

# Optimisations for faster builds and smaller images
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Install dependencies first (for layer caching)
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

COPY . .

# Install the project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# --- Stage 2: Runtime Stage ---
FROM python:3.12-slim-bookworm

WORKDIR /workspace

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

COPY --from=builder --chown=python:python /workspace/.venv /workspace/.venv

COPY --chown=python:python . .

ENV PATH="/workspace/.venv/bin:$PATH"

USER python

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]