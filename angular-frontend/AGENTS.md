# Project Development Guidelines

## Project

This is an Angular 21 application.

The project uses:

* Angular 21
* TypeScript
* Angular CLI
* Angular Signals
* Standalone APIs
* Angular's modern template control flow
* Angular CLI MCP server

## General Rules

* Treat `package.json` as the source of truth for dependency versions.
* Use only stable Angular APIs supported by the project's installed Angular version.
* Prefer modern Angular APIs over legacy APIs when creating new code.
* Do not introduce a new dependency when Angular or an existing project dependency already provides the required functionality.
* Do not perform broad refactoring or modernization unless explicitly requested.
* Preserve the existing architecture and conventions unless there is a good reason to change them.
* Never use `any` unless there is a documented reason.
* Keep TypeScript strict and type-safe.
* Follow the existing project's formatting and linting configuration.

## Angular

For Angular-specific work:

1. Inspect the existing workspace before making architectural changes.
2. Use the Angular CLI MCP server when an appropriate MCP operation is available.
3. Prefer Angular's current stable APIs and patterns.
4. Do not invent Angular APIs. Verify unfamiliar APIs using Angular MCP or official Angular documentation.
5. Prefer standalone APIs and avoid introducing new NgModules.
6. Prefer Signals for local reactive state.
7. Prefer modern Angular template control flow.
8. Prefer functional APIs where Angular provides them.
9. Keep code compatible with Angular 21's recommended application architecture.

## Verification

After making code changes:

* Run the appropriate formatter/linter if configured.
* Run Angular tests relevant to the change.
* Run the Angular build for significant changes.
* Fix compilation, type-checking, template, and test errors before considering the task complete.

Do not claim that code works without verifying it when verification is possible.
