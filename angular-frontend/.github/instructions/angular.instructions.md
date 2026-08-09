---
name: Angular 21 Development Standards
description: Modern Angular 21 coding conventions and architecture
applyTo: "**/*.ts,**/*.html,**/*.scss"
---

# Angular 21 Development Standards

## Components

- Use standalone components.
- Do not create new NgModules.
- Prefer small, focused components.
- Prefer `input()` and `input.required()` over decorator-based `@Input()` for new code.
- Prefer `output()` over decorator-based `@Output()` for new code.
- Prefer signal-based queries such as `viewChild()` and `viewChildren()` where appropriate.
- Use `inject()` for dependency injection in new code where it improves clarity.

## Signals

Prefer Signals for local reactive state.

Use:

* `signal()` for writable state.
* `computed()` for derived state.
* `linkedSignal()` when state needs to react to changing source values while remaining writable.
* `resource()` / `httpResource()` when appropriate and supported by the project's requirements.

Do not use `effect()` as a replacement for `computed()` or for ordinary state synchronization. Use effects only for genuine side effects.

Avoid introducing RxJS solely for local component state when Signals provide a simpler solution.

Continue using RxJS where it is appropriate for streams, events, async workflows, or existing application architecture.

## Templates

Prefer Angular's built-in control flow:

* `@if`
* `@else`
* `@for`
* `@empty`
* `@switch`

For new code, do not use:

* `*ngIf`
* `*ngFor`
* `*ngSwitch`

Use `track` with `@for` when iterating collections.

Prefer `@defer` when deferred loading provides a meaningful performance benefit.

## Dependency Injection

Prefer:

```typescript
private readonly userService = inject(UserService);
```

for new code where appropriate.

Do not migrate existing constructor injection merely for the sake of modernization.

## HTTP

Prefer Angular's modern functional configuration:

```typescript
provideHttpClient()
```

Prefer functional interceptors for new interceptors.

Keep API communication out of presentation components where practical.

If an OpenAPI-generated API client exists, use it rather than manually duplicating API models and HTTP calls.

## Routing

Prefer standalone route configuration.

Prefer functional:

* guards
* resolvers
* route providers

Use lazy loading for application features where appropriate.

## Change Detection

Write components that are compatible with Angular's modern change-detection model and zoneless applications.

Avoid manual change detection unless there is a demonstrated requirement.

## Forms

Use the current stable Angular forms APIs supported by Angular 21.

Prefer Signal Forms when appropriate for new forms and when they provide a clear benefit.

Do not automatically migrate existing Reactive Forms or Template-driven Forms unless requested.

## TypeScript

* Use strict typing.
* Avoid `any`.
* Prefer `unknown` when a value is genuinely unknown.
* Prefer immutable state where practical.
* Use readonly properties where appropriate.
* Keep public APIs strongly typed.

## Accessibility

All user-facing components must consider accessibility.

* Use semantic HTML.
* Provide accessible names for interactive controls.
* Use appropriate ARIA only when semantic HTML is insufficient.
* Ensure keyboard accessibility.
* Do not rely solely on color to communicate information.

## Testing

New functionality should include appropriate tests.

Prefer testing observable behavior rather than implementation details.

Do not introduce tests that depend unnecessarily on private implementation details.
