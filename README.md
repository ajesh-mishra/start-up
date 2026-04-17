## Start-up
Command to build & start all the services/ containers.

- Angular Frontend
- Fastapi Backend
- Postgres Database
- DevOps Toolbox

```bash
# Command to build all the images
docker compose build --no-cache

# Command to start all the services
docker compose up
```

Access the application using URLs

- UI - http://localhost:4200/
- API - http://localhost:8000/docs

### Docker Compose networking note

- From your browser, use `localhost` (example: `http://localhost:4200/api/...`).
- Inside containers, use service names on the Compose network (example: `http://fastapi-backend:8000`).
- In this setup, Nginx in the frontend container proxies `/api/*` to the backend service.