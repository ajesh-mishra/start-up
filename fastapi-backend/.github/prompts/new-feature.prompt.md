---
name: New FastAPI Feature
description: Implement a new FastAPI backend feature following project architecture
---

Implement the requested FastAPI feature.

Before making changes:

1. Read `AGENTS.md`.
2. Read `ARCHITECTURE.md`.
3. Inspect the existing project structure.
4. Identify similar existing functionality.
5. Follow existing project conventions.

Implementation:

1. Determine whether the feature requires:

   * API routes
   * Pydantic schemas
   * services
   * repositories
   * dependencies
   * configuration
   * tests

2. Keep route handlers thin.

3. Put business logic in services.

4. Put persistence operations in repositories.

5. Use Pydantic models at API boundaries.

6. Use dependency injection where appropriate.

7. Follow the project's async conventions.

8. Do not introduce unnecessary dependencies.

9. Use `uv` for dependency management and project commands.

API:

* Use appropriate HTTP methods and status codes.
* Define explicit response models.
* Ensure the OpenAPI specification accurately represents the API.
* Consider backward compatibility when modifying an existing endpoint.

Testing:

* Add unit tests where appropriate.
* Add API tests for new endpoints.
* Add regression tests for bug fixes.

Verification:

Run the relevant formatter/linter, type checker, and tests.

For significant changes, run:

```bash
uv run pytest
```

and verify that the application starts successfully.

Summarize:

* files changed
* architectural decisions
* tests added
* verification performed
