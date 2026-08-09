---
name: Python Development Standards
description: Python coding standards for this FastAPI project
applyTo: "**/*.py"
---

# Python Development Standards

## Python Version

Use the Python version specified in `pyproject.toml`.

Do not use language features newer than the project's configured Python version.

## Type Safety

Use strong typing throughout the application.

Prefer:

```python
def get_user(user_id: int) -> User:
    ...
```

over untyped functions.

Avoid:

```python
def get_user(user_id):
    ...
```

Avoid `Any` unless there is a specific justification.

Prefer `Optional[T]` only when required by the project's Python version; otherwise use modern union syntax:

```python
str | None
```

## Data Structures

Prefer explicit domain types over unstructured dictionaries.

Use:

* Pydantic models for external/API data
* dataclasses for lightweight internal value objects where appropriate
* enums for constrained sets of values

Avoid deeply nested untyped dictionaries.

## Error Handling

Do not use broad exception handling such as:

```python
except Exception:
    ...
```

unless the exception is intentionally handled at an application boundary.

Catch specific exceptions.

Preserve useful exception context when re-raising.

## Logging

Use Python's logging infrastructure rather than `print()` for application logging.

Do not log:

* passwords
* access tokens
* API keys
* secrets
* sensitive request payloads

Use structured logging where supported by the project.

## Async

Do not perform blocking I/O inside async functions.

Be careful with:

* synchronous HTTP clients
* synchronous database drivers
* filesystem operations
* subprocesses
* CPU-intensive operations

Use appropriate asynchronous libraries where the application requires asynchronous I/O.

## Code Quality

Prefer small functions with clear responsibilities.

Avoid premature abstractions.

Do not create generic utility functions unless they are actually reused or represent a meaningful domain concept.

Prefer readable code over clever code.
