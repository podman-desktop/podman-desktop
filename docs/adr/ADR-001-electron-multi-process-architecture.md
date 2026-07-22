# ADR-001: Electron Multi-Process Architecture

**Date**: 2022-01 (project inception)
**Status**: Accepted

## Context

Podman Desktop needs to be a cross-platform desktop application that integrates with local container engines (Podman, Docker) and Kubernetes clusters. The application requires:

- Native OS integration (system tray, menus, file system access)
- A modern web-based UI for container management
- Secure communication between the UI and system-level operations
- Extension support for third-party integrations

## Decision

Use Electron's multi-process architecture with three process types:

1. **Main Process** (`packages/main`): Node.js environment handling container engine integrations, Kubernetes provider management, extension hosting, and system tray/menu management.
2. **Renderer Process** (`packages/renderer`): Chromium-based UI running Svelte 5+ with Tailwind CSS, communicating with main via IPC.
3. **Preload Scripts** (`packages/preload*`): Security bridges that selectively expose main process APIs to the renderer using `contextBridge.exposeInMainWorld()`.

All IPC uses a `{ result, error }` envelope pattern for consistent error handling.

## Consequences

- **Positive**: Cross-platform (macOS, Linux, Windows) from a single codebase
- **Positive**: Strong security boundary between UI and system operations
- **Positive**: Rich native OS integration (tray, notifications, auto-update)
- **Negative**: Higher memory footprint than native applications
- **Negative**: IPC serialization overhead for frequent data updates
- **Negative**: Complexity of managing three separate process types
