## Start-up
Command to build & start all the services/ containers.

- Angular Frontend
- Fastapi Backend
- Postgres Database
- DevOps Toolbox

```bash
docker compose up --build
```

Access the application using URLs

- [Angular Frontend](http://localhost:4200/)
- [FastAPI Swagger](http://localhost:8000/docs)
- [OpenAPI Specification](http://localhost:8000/openapi.json)


### Build and push images with Docker Buildx Bake

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

- **From your browser (host machine):** use published ports on `localhost`.
	- Frontend UI: `http://localhost:4200`
	- Backend directly: `http://localhost:8000`
- **From one container to another:** use Compose service names (not `localhost`).
	- Example: `http://fastapi-backend:8000`
- **Frontend API calls should stay relative** (for example, `/api/products`).
	- In production compose, Nginx in `angular-frontend` forwards `/api/*` to `fastapi-backend:8000`.
	- In Angular dev mode (`ng serve`), `proxy.conf.json` does the same forwarding.

Quick rule: use `localhost` from your browser, and service names only from inside containers.