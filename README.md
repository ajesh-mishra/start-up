## Start-up
Command to build & start all the services/ containers.

- Angular Frontend
- Fastapi Backend
- Postgres Database
- DevOps Toolbox

```bash
# Build + start all services
docker compose up --build

# For a clean database reset (optional)
docker compose down -v
```

Access the application using URLs

- UI - http://localhost:4200/
- API - http://localhost:8000/docs

## Build and push images with Docker Buildx Bake

Use the root `docker-bake.hcl` to build both images consistently.

```bash
# One-time setup for buildx (if not already created)
docker buildx create --name startup-builder --use --bootstrap

# Build and push both images (multi-arch) in one command
docker buildx bake all --set TAG=0.0.1 --push
```

Push `latest` tag:

```bash
docker login

docker buildx bake all --push
```

### Docker Compose networking note

- From your browser, use `localhost` (example: `http://localhost:4200/api/...`).
- Inside containers, use service names on the Compose network (example: `http://fastapi-backend:8000`).
- In this setup, Nginx in the frontend container proxies `/api/*` to the backend service.