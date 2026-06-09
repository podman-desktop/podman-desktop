# ADR-002: Plugin-Based Extension System

**Date**: 2022-Q2
**Status**: Accepted

## Context

Podman Desktop needs to support multiple container engines and Kubernetes distributions without coupling the core application to any specific engine. New engines and tools emerge regularly, and the community should be able to contribute integrations without modifying core code.

## Decision

Implement a VS Code-inspired extension system where:

1. Extensions declare capabilities in a `package.json` manifest
2. Each extension receives an `ExtensionContext` with a typed API (`@podman-desktop/api`)
3. Extensions register providers (container, Kubernetes, authentication) through the API
4. Built-in extensions (`extensions/`) use the same API as external ones
5. The extension host runs in the main process with sandboxed API access

The public API is published as `@podman-desktop/api` on npm and defined in `packages/extension-api/`.

## Consequences

- **Positive**: Clean separation between core and engine-specific code
- **Positive**: Third-party developers can create extensions without forking
- **Positive**: Built-in extensions serve as reference implementations
- **Positive**: Docker Desktop extension compatibility layer is possible
- **Negative**: API surface must be carefully maintained (breaking changes affect all extensions)
- **Negative**: Extension debugging requires understanding the host/guest boundary
