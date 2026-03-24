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
├── api/               - Types shared between the renderer, main and preloads packages
├── extension-api/     - Extension API implementation (published as `@podman-desktop/api`)
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

### ESLint Rules

Before writing or modifying code, always check `eslint.config.mjs` to understand which linting rules are active. Rules vary by file type and package — consult the config directly rather than assuming defaults.

### Svelte Reactive Patterns

When setting a variable reactively, prefer in this order:

1. **`$derived` (with optional `await`)** — use when the value can be computed from existing state or an async source. Svelte 5.36+ supports `await` inside `$derived`.
2. **`onMount`** — use when you need to fetch or set a value once after the component mounts and `$derived` is not applicable.
3. **`$effect`** — use only as a last resort for side effects that cannot be expressed as a derivation.

```ts
// ✅ Preferred: $derived (sync or async)
let items = $derived(await fetchItems());

// ✅ Acceptable: onMount when $derived does not fit
let items = $state<Item[]>([]);
onMount(async () => {
  items = await fetchItems();
});

// 🚫 Avoid: $effect for setting variables
let items = $state<Item[]>([]);
$effect(() => {
  fetchItems().then(result => {
    items = result;
  });
});
```

> **Note:** `$derived` variables are read-only — you cannot reassign them (e.g. `items = [something]` will be a compile error). If you need to mutate the variable elsewhere in the component (e.g. in response to a user action), use `$state` + `onMount` instead:
>
> ```ts
> // 🚫 Won't work — cannot assign to a $derived variable
> let items = $derived(await fetchItems());
> items = []; // ❌ compile error
>
> // ✅ Use $state + onMount when you also need to write to the variable
> let items = $state<Item[]>([]);
> onMount(async () => {
>   items = await fetchItems();
> });
> // later in the component:
> items = []; // ✅ fine
> ```

### Testing Patterns

- When mocking modules, use `vi.mock(import('./path/to/module'))` (with a dynamic `import()` expression) instead of `vi.mock('./path/to/module')` (string literal). This provides better type inference and IDE support.
- Use `vi.mocked(fn)` to get a typed mock reference, then configure it with `.mockReturnValue()` / `.mockResolvedValue()` and assert with `expect()`.

```ts
// ✅ Preferred
vi.mock(import('node:fs'));
vi.mock(import('./Compo2.svelte'));

// 🚫 Avoid
vi.mock('node:fs');
vi.mock('./Compo2.svelte');
```

**Setting up and asserting mocks:**

```ts
import { readFileSync } from 'node:fs';
import { beforeEach, expect, test, vi } from 'vitest';

vi.mock(import('node:fs'));

beforeEach(() => {
  vi.resetAllMocks();
});

test('returns parsed content', () => {
  vi.mocked(readFileSync).mockReturnValue('hello');
  const result = parseFile('/some/path');
  expect(result).toBe('hello');
  expect(readFileSync).toHaveBeenCalledWith('/some/path', 'utf-8');
});
```

For comprehensive coding and testing guidelines, see [CODE-GUIDELINES.md](CODE-GUIDELINES.md).

### Commits & Pull requests

- We use semantic commits (E.g. `feat(renderer): updating something`)
- Every commit must be signed
- AI assisted commit should be mentioned
- Respect the GitHub template for the pull request body

## Resources

- **Comprehensive guidelines:** [CODE-GUIDELINES.md](CODE-GUIDELINES.md)
- **Contributing guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **API documentation:** `website/docs/extensions/`
- **Component library:** Run `pnpm --filter storybook dev`
