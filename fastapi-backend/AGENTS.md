# Project Agent Instructions

## Project Overview

This is a Python backend application built with:

* Python
* FastAPI
* Pydantic
* `uv` for dependency and environment management
* Pytest for testing

## General Rules

* Read `ARCHITECTURE.md` before making significant architectural changes.
* Inspect the existing project structure before introducing new patterns.
* Follow the existing project conventions unless there is a strong reason to change them.
* Prefer simple, explicit, maintainable code over unnecessary abstractions.
* Do not introduce dependencies when the Python standard library or an existing project dependency is sufficient.
* Do not make broad refactoring changes unless explicitly requested.
* Keep functions and classes focused on a single responsibility.
* Prefer composition over inheritance where practical.

## Python

* Use the Python version specified in `pyproject.toml`.
* Use modern Python typing.
* Avoid `Any` unless there is a specific reason.
* Prefer explicit type annotations for public functions, classes, and API boundaries.
* Use `dataclass` or Pydantic models where appropriate rather than unstructured dictionaries.
* Follow the project's formatter and linter configuration.
* Write idiomatic Python rather than translating patterns from other languages.

## Dependency Management

`uv` is the only package and environment management tool for this project.

Use:

```bash
uv add <package>
```

to add runtime dependencies.

Use:

```bash
uv add --dev <package>
```

to add development dependencies.

Use:

```bash
uv sync
```

to synchronize the environment.

Run Python commands using:

```bash
uv run <command>
```

Do not use `pip install` directly.

Development server:
```bash
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

Do not create or manage a separate virtual environment manually unless explicitly required.

Commit `uv.lock` changes when dependencies are intentionally changed.

## FastAPI

* Use FastAPI's current stable APIs supported by the project's installed version.
* Use Pydantic models for request and response validation.
* Define explicit response models for API endpoints.
* Keep API route handlers thin.
* Put business logic in services rather than route handlers.
* Use FastAPI dependency injection for shared dependencies.
* Prefer `APIRouter` to organize API endpoints.
* Do not put database access, complex business logic, or external service calls directly into route handlers.
* Use appropriate HTTP status codes.
* Raise `HTTPException` or project-specific exceptions at the appropriate application boundary.
* Do not expose internal exception details to API consumers.

## Async

* Use `async def` when the endpoint or operation performs asynchronous I/O.
* Do not use blocking operations inside asynchronous request handlers.
* Use synchronous functions when the underlying operation is synchronous.
* Do not add `async` merely because an endpoint is implemented with FastAPI.
* Be particularly careful with blocking database drivers, filesystem operations, subprocesses, and HTTP clients.

## Pydantic

* Use Pydantic models for external data validation and API contracts.
* Keep request and response schemas separate from persistence models where appropriate.
* Prefer explicit models over loosely typed dictionaries.
* Use Pydantic validation rather than duplicating validation logic in route handlers.
* Do not expose database/ORM models directly as public API contracts unless there is a deliberate reason.

## API Contract

The API contract is defined by FastAPI's generated OpenAPI specification.

The frontend consumes the API through generated TypeScript types/client where applicable.

Do not manually duplicate API request and response models in the frontend.

When changing an API:

1. Consider backward compatibility.
2. Update Pydantic schemas.
3. Verify the generated OpenAPI specification.
4. Update affected tests.
5. Consider the impact on the frontend API client.

## Testing

* Use pytest.
* Add tests for new functionality.
* Prefer testing behavior rather than implementation details.
* Test API endpoints through FastAPI's testing facilities.
* Include validation and error cases where appropriate.
* Avoid excessive mocking.
* Keep tests deterministic and isolated.

## Verification

After making significant changes:

1. Run formatting/linting.
2. Run type checking if configured.
3. Run relevant tests.
4. Run the full test suite when appropriate.
5. Start the FastAPI application when runtime verification is useful.

Use `uv run` for all project commands.

Do not claim that an implementation works without performing appropriate verification.
