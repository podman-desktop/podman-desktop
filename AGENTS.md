# AGENTS.md

This file provides guidance for AI agents working with Podman Desktop code in this repository.

## Overview

Podman Desktop is a graphical desktop application for managing containers and Kubernetes. It's built with:

- **Frontend:** Svelte 5+ and TypeScript
- **Runtime:** Electron (multi-process architecture)
- **Styling:** Tailwind CSS 4+
- **Build tooling:** Vite 7+ and pnpm 10+ workspaces

> **Note:** Version numbers indicate minimum supported versions. The project supports these versions and higher.

The application supports multiple container engines (Podman, Docker, Lima, CRC) and can be extended through a plugin-based extension system.

## Quick Start

```bash
# Prerequisites: Node.js 24+, pnpm 10.x
pnpm install              # Install all dependencies
pnpm watch                # Start development with hot reload
pnpm compile:current      # Build production binary for local platform
```

**macOS Note:** After compiling, ad-hoc sign the binary:

```bash
codesign --force --deep --sign - "dist/mac-arm64/Podman Desktop.app"
```

## Essential Commands

### Development & Build

```bash
pnpm watch                # Development mode with hot reload
pnpm build                # Build all packages
pnpm build:main           # Build main process only
pnpm build:renderer       # Build renderer process only
pnpm build:extensions     # Build all built-in extensions
pnpm build:ui             # Build UI component library
pnpm compile:current      # Create production binary for current platform
```

> **Note:** Additional build targets are available. See `package.json` for the complete list.

### Testing

Unit tests use **Vitest**. E2E tests use **Playwright**.

```bash
# Unit Tests (Vitest)
pnpm test:unit            # Run all unit tests
pnpm test:unit:coverage   # Run with coverage report
pnpm test:watch           # Watch mode for development
pnpm test:main            # Test main process only
pnpm test:renderer        # Test renderer process only
pnpm test:ui              # Test UI components
pnpm test:preload         # Test preload scripts
pnpm test:extensions      # Test all extensions

# Run a single test file (Vitest)
pnpm exec vitest run path/to/test-file.spec.ts

# E2E Tests (Playwright)
pnpm test:e2e             # Full E2E suite (excludes @k8s_e2e)
pnpm test:e2e:smoke       # Smoke tests only
pnpm test:e2e:extension   # Extension installation tests

# View E2E Results
pnpm exec playwright show-report tests/playwright/output/html-results
```

### Code Quality

```bash
# Run before committing
pnpm lint-staged          # Lint and format staged files

# Individual checks
pnpm typecheck            # TypeScript type checking (all packages)
pnpm lint:check           # ESLint check
pnpm lint:fix             # ESLint auto-fix
pnpm format:check         # Biome + Prettier check
pnpm format:fix           # Biome + Prettier auto-fix
```

## Architecture

Podman Desktop follows Electron's multi-process architecture with a pnpm monorepo structure.

### Process Architecture

**Main Process** (`packages/main`)

- Node.js backend environment
- Container engine integrations (Podman, Docker, Lima)
- Kubernetes provider management
- Extension system host
- System tray and menu management

**Renderer Process** (`packages/renderer`)

- Svelte 5+ UI application
- Runs in Chromium environment
- Communicates with main via IPC

**Preload Scripts** (`packages/preload*`)

- Security bridge between main and renderer
- Exposes safe APIs to renderer
- Separate preloads for main app, webviews, and Docker extensions

### Key Packages

```
packages/
├── main/              - Electron main process (backend)
├── renderer/          - Svelte UI (frontend)
├── ui/                - Shared UI components (@podman-desktop/ui-svelte)
├── api/               - Extension API types (@podman-desktop/api)
├── extension-api/     - Extension API implementation
├── preload/           - Main preload bridge
├── preload-docker-extension/  - Docker extension preload
└── preload-webview/   - Webview preload

extensions/            - Built-in extensions
├── compose/           - Docker Compose support
├── docker/            - Docker engine integration
├── podman/            - Podman engine integration
├── kind/              - Kind (Kubernetes in Docker)
├── kubectl-cli/       - kubectl CLI manager
└── ...

tests/playwright/      - E2E tests
storybook/            - UI component showcase
website/              - Documentation site (Docusaurus)
```

### Technology Stack

| Layer            | Technologies                                                |
| ---------------- | ----------------------------------------------------------- |
| **Runtime**      | Electron 40+, Node.js 24+                                   |
| **Language**     | TypeScript 5.9+ (strict mode)                               |
| **UI Framework** | Svelte 5+                                                   |
| **Styling**      | Tailwind CSS 4+                                             |
| **Build**        | Vite 7+, pnpm 10+                                           |
| **Testing**      | Vitest 4+ (unit), Playwright (E2E), @testing-library/svelte |
| **Linting**      | ESLint 9+, Biome                                            |
| **Formatting**   | Biome, Prettier (markdown only)                             |

### Extension System

Extensions can:

- Add custom container engine providers
- Register Kubernetes providers
- Contribute UI views and commands
- Hook into application lifecycle events
- Extend Docker Desktop compatibility

Built-in extensions are in `extensions/` and follow the same API as external extensions.

## Important Guidelines

### Before Making Changes

1. **Read first:** See [CODE-GUIDELINES.md](CODE-GUIDELINES.md) for coding standards
2. **Run tests:** Ensure existing tests pass
3. **Type safety:** Maintain strict TypeScript compliance
4. **Format code:** Run `pnpm lint-staged` before committing

### Testing Requirements

- **Unit tests** are mandatory for new features (Vitest)
- **E2E tests** required for UI workflows (Playwright)
- Maintain or improve code coverage
- Test on multiple platforms when possible (macOS, Linux, Windows)

### Code Style

- TypeScript strict mode enforced
- Use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`)
- Follow ESLint and Biome rules
- Tailwind CSS for styling (no custom CSS unless necessary)

## Resources

- **Comprehensive guidelines:** [CODE-GUIDELINES.md](CODE-GUIDELINES.md)
- **Contributing guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **API documentation:** `website/docs/extensions/`
- **Component library:** Run `pnpm --filter storybook dev`
