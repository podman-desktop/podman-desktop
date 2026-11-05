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

### IPC sender authorization

Shared plugin IPC handlers accept only the main frame of the WebContents registered
when the application window is created, at its expected renderer URL. Other
windows, subframes, and navigated documents are rejected.

Extension webviews hosted by that window have a narrow channel allowlist matching
their preload APIs. Their URLs must match registered contributions or webviews;
Docker execution contribution IDs, webview state/message IDs, and Docker VM service
ports must belong to the calling webview. File URLs are compared by page URL, not
their shared `null` origin. Window recreation replaces the authorized WebContents.

The application window enables Chromium web security. Docker host execution passes
arguments directly to the executable without an implicit shell, matching streaming
execution. Extensions requiring shell syntax must explicitly invoke a shell; ordinary
arguments, including metacharacters, remain data.

These checks do not sandbox installed extensions or prevent a compromised authorized
renderer from using its intended privileges.

## Consequences

- **Positive**: Cross-platform (macOS, Linux, Windows) from a single codebase
- **Positive**: Strong security boundary between UI and system operations
- **Positive**: Rich native OS integration (tray, notifications, auto-update)
- **Negative**: Higher memory footprint than native applications
- **Negative**: IPC serialization overhead for frequent data updates
- **Negative**: Complexity of managing three separate process types
