# ADR-003: Inversify Dependency Injection in Main Process

**Date**: 2024-Q1
**Status**: Accepted

## Context

The main process (`packages/main`) grew to contain hundreds of services with complex interdependencies. Constructor parameter lists became unwieldy, making it difficult to:

- Instantiate services in the correct order
- Write unit tests with proper mocking
- Add new services without modifying existing constructors

## Decision

Adopt Inversify as the IoC container for the main process:

1. Services are decorated with `@injectable()` and use `@inject()` for dependencies
2. Bindings are configured in `PluginSystem.initExtensions()`
3. Common cross-cutting concerns (`ApiSender`, `IPCHandle`, `Telemetry`) are injected via tokens
4. IPC handler registration is co-located with the service that owns the domain (e.g., `ContainerProviderRegistry.initIpcHandlers()`)

## Consequences

- **Positive**: Explicit dependency declaration via constructor injection
- **Positive**: Easy to mock dependencies in unit tests
- **Positive**: Services can be registered and resolved in any order
- **Negative**: Added runtime dependency and decorator overhead
- **Negative**: Learning curve for contributors unfamiliar with DI patterns
- **Neutral**: Existing services migrated incrementally (not all at once)
