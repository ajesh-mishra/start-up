---
name: FastAPI Development Standards
description: FastAPI and Pydantic development standards
applyTo: "**/*.py"
---

# FastAPI Development Standards

## API Structure

Organize endpoints using `APIRouter`.

Prefer:

```python
router = APIRouter(prefix="/users", tags=["users"])
```

over putting all endpoints directly in `main.py`.

`main.py` should primarily be responsible for application creation and application-wide configuration.

## Route Handlers

Keep route handlers thin.

A route handler should generally:

1. Validate input through Pydantic.
2. Obtain required dependencies.
3. Call the appropriate service.
4. Return the response.

Avoid placing complex business logic in route handlers.

Example:

```python
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    return await service.get_user(user_id)
```

## Pydantic

Use Pydantic models for API boundaries.

Prefer separate models for:

* request bodies
* response models
* internal/domain models when appropriate

For example:

```python
class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
```

Do not expose persistence models directly unless intentionally designed as the API contract.

## Dependency Injection

Use FastAPI dependency injection for:

* database sessions
* authenticated users
* authorization
* configuration
* service dependencies
* reusable request-level dependencies

Keep dependency functions focused.

## Configuration

Application configuration should be centralized.

Do not scatter environment variable access throughout the application.

Prefer a typed settings model.

## API Errors

Use appropriate HTTP status codes.

For expected API errors, use appropriate FastAPI exception mechanisms.

Do not return arbitrary error dictionaries from individual endpoints.

Maintain a consistent API error format across the application.

## OpenAPI

FastAPI's OpenAPI specification is the API contract.

Ensure endpoints have:

* meaningful operation names
* tags
* response models
* appropriate status codes
* useful descriptions where necessary

Do not manually maintain a separate API specification when FastAPI can generate it.

## API Versioning

If API versioning is required, keep versioning explicit in the router structure.

For example:

```text
/api/v1/users
/api/v1/orders
```

Avoid introducing versioning inconsistently across endpoints.

## Security

Never hard-code:

* credentials
* API keys
* tokens
* passwords
* private keys

Use environment-based configuration or the project's secret-management mechanism.

Do not log credentials or authentication tokens.

## Startup and Shutdown

Use FastAPI's current lifespan mechanisms for application startup and shutdown behavior.

Avoid introducing legacy startup/shutdown patterns into new code.

## Documentation

Use FastAPI's generated OpenAPI documentation.

Add endpoint documentation when it provides meaningful information to API consumers.

Do not duplicate information that can already be inferred from typed Pydantic models.
