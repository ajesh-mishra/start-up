---

name: New Angular Feature
description: Implement a new Angular feature following project architecture and Angular 21 conventions
------------------------------------------------------------------------------------------------------

Implement the requested Angular feature.

Before changing code:

1. Inspect the existing project structure.
2. Identify similar existing features and follow their architecture.
3. Check the project's Angular version.
4. Use the Angular MCP server for workspace-aware Angular operations where appropriate.
5. Identify the appropriate components, services, routes, models, and tests.

Implementation rules:

* Follow `AGENTS.md`.
* Follow the Angular 21 instructions.
* Prefer standalone APIs.
* Prefer Signals for local reactive state.
* Use modern Angular template control flow.
* Avoid introducing legacy Angular patterns.
* Reuse existing services and components where appropriate.
* Avoid unnecessary dependencies.

After implementation:

1. Run formatting/linting if configured.
2. Run relevant tests.
3. Run the Angular build.
4. Fix any errors.
5. Summarize the files changed and verification performed.
