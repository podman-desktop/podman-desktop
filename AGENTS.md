# AGENTS.md

This file provides guidance for any AI tool working with Podman Desktop code in this repository.

## Overview

Podman Desktop is a graphical desktop application for managing containers and Kubernetes, built with Electron, Svelte 5, and TypeScript. It supports multiple container engines (Podman, Docker, Lima, CRC) and extends functionality through a plugin-based extension system.

## Essential Commands

### Development

```bash
pnpm install              # Install dependencies (requires Node.js 24+, pnpm v10.x)
pnpm watch                # Start dev mode with hot reload
pnpm compile:current      # Build production binary for local platform
```

Note: On macOS, ad-hoc sign the compiled binary before running:

```bash
codesign --force --deep --sign - "dist/mac-arm64/Podman Desktop.app"
```

### Code Quality

```bash
pnpm lint-staged          # Run linter and formatter on staged files
pnpm lint:check           # ESLint check
pnpm lint:fix             # ESLint auto-fix
pnpm format:check         # Biome + Prettier check
pnpm format:fix           # Biome + Prettier auto-fix
pnpm typecheck            # TypeScript type checking across all packages
```

### Build

```bash
pnpm build                # Build all packages (main, preload, renderer, extensions, UI)
pnpm build:main           # Build main process only
pnpm build:renderer       # Build renderer only
pnpm build:extensions     # Build all extensions
pnpm build:ui             # Build UI component library
```

### Testing

```bash
# Unit tests
pnpm test:unit                      # All unit tests
pnpm test:main                      # Main process tests only
pnpm test:renderer                  # Renderer tests only
pnpm test:extensions                # All extension tests
pnpm test:extensions:compose        # Specific extension tests

# E2E tests
pnpm test:e2e                       # Standard E2E tests (excludes @k8s_e2e)
pnpm test:e2e:smoke                 # Smoke tests only (@smoke tag)
pnpm test:e2e:extension             # Extension installation tests

# View E2E test results
pnpm exec playwright show-report tests/playwright/output/html-results
```

## Architecture

### Electron Three-Process Model

Podman Desktop follows Electron's security-first architecture with strict process separation:

**Main Process** (`packages/main/`)

- Entry: `src/index.ts` → `src/main.ts`
- Runs all business logic (container/Kubernetes operations)
- Uses **Inversify** for dependency injection throughout
- Key components:
  - `PluginSystem`: Orchestrates core services and extension loading
  - `mainWindow.ts`: Window management
  - `tray-menu.ts`, `tray-animate-icon.ts`: System tray
  - `protocol-launcher.ts`: Deep linking support
  - `plugin/`: Extension system, registries, and core services

**Preload Scripts** (Security Bridge)

- `packages/preload/`: Main window bridge → exposes `window.events` API
- `packages/preload-docker-extension/`: Docker Desktop extension compatibility
- `packages/preload-webview/`: Extension webview isolation
- Uses `contextBridge.exposeInMainWorld()` for secure IPC
- Auto-generates TypeScript types: `exposedInMainWorld.d.ts`

**Renderer Process** (`packages/renderer/`)

- Svelte 5 application with Tailwind CSS
- Entry: `src/main.ts` → `src/App.svelte`
- Router: Tinro (memory-based)
- State: Svelte stores in `src/stores/` (~100 reactive stores)
- NO direct Node.js access—all communication via preload APIs

### Extension System

**Extension API** (`packages/extension-api/`)

- Single definition file: `extension-api.d.ts` (~180 exported types)
- Published as `@podman-desktop/api` on npm
- Extensions export `activate(context)` and `deactivate()` functions

**Built-in Extensions** (`extensions/`)

- Each extension is a separate npm package
- Examples: `podman`, `docker`, `compose`, `kind`, `kubectl-cli`, `kube-context`, `lima`, `registries`
- Loaded via `ExtensionLoader` (`packages/main/src/plugin/extension/extension-loader.ts`)
- Extensions can contribute:
  - Commands, menu items, configuration properties
  - Container/Kubernetes providers
  - Onboarding workflows, custom views, webviews
  - CLI tools, icons, themes

**Extension Development**

- Run `pnpm watch` for hot reload during development
- Extensions auto-reload on file changes via `ExtensionWatcher`
- Test individual extensions: `pnpm test:extensions:<name>`

### Package Structure

```
packages/
├── main/                    # Electron main process (business logic)
├── renderer/                # Svelte UI application
├── preload/                 # Main window IPC bridge
├── preload-docker-extension/# Docker extension compatibility
├── preload-webview/         # Extension webview bridge
├── ui/                      # Shared Svelte component library (@podman-desktop/ui-svelte)
├── extension-api/           # Public extension API definitions
└── api/                     # Shared TypeScript interfaces/types

extensions/                  # Built-in extensions (separate npm packages)
tests/playwright/            # E2E tests
website/                     # Docusaurus documentation site
```

### UI Component Library (`packages/ui/`)

Published as `@podman-desktop/ui-svelte` for reuse across renderer and extensions:

- Common components: `Button`, `Input`, `Checkbox`, `Dropdown`, `Table`, `Spinner`, `Tooltip`
- Layout components: `Page`, `FormPage`, `NavPage`, `DetailsPage`, `EmptyScreen`
- Uses Tailwind CSS v4 and FontAwesome icons
- Import via: `import { Button } from '@podman-desktop/ui-svelte';`

### State Management

Svelte stores in `packages/renderer/src/stores/`:

- Container, image, pod, volume stores
- Kubernetes resource stores
- Configuration, provider, extension stores
- UI state (breadcrumbs, navigation, appearance)
- All stores are reactive and auto-update UI

## Code Guidelines

For comprehensive guidelines, see [CODE-GUIDELINES.md](CODE-GUIDELINES.md).

### Import Paths

Use path aliases (defined in `vite.config.js` and `tsconfig.json`) instead of relative paths:

```typescript
// Good
import type { WSL2Check } from '/@/checks/windows/wsl2-check';
import { WinPlatform } from './win-platform';

// Bad
import type { WSL2Check } from '../checks/windows/wsl2-check';
```

### Svelte Best Practices

**Avoid inline functions in templates:**

```svelte
<!-- Good -->
<script lang="ts">
async function onButtonClicked(): Promise<void> {
  // logic here
}
</script>
<button on:click={onButtonClicked}>

<!-- Bad -->
<button on:click={(): Promise<void> => { /* logic */ }}>
```

**Use `.bind()` to pass parameters:**

```svelte
<!-- Good -->
<script lang="ts">
async function onButtonClicked(object: Object): Promise<void> {
  // logic
}
</script>
{#each objects as object (object.id)}
  <button on:click={onButtonClicked.bind(undefined, object)}>
{/each}

<!-- Bad -->
{#each objects as object (object.id)}
  <button on:click={(): Promise<void> => onButtonClicked(object)}>
{/each}
```

**Use Icon component for all icons:**

```svelte
<!-- Good -->
<script lang="ts">
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
</script>
<Icon icon={faGear} size="xs" />

<!-- Bad -->
<i class="fas fa-gear"></i>
```

**Use async/await in $derived (Svelte 5.36+):**

```svelte
<!-- Good -->
<script lang="ts">
let data = $derived(await fetchData());
</script>
<p>Data: {data}</p>

<!-- Bad - unnecessary promise handling -->
<script lang="ts">
let dataPromise = $derived(fetchData());
</script>
{#await dataPromise}...{/await}
```

### UI Colors

Colors are managed by `packages/main/src/plugin/color-registry.ts` for light/dark mode switching.

Reference colors using the format: `[var(--pd-<category>-<name>)]`

Example:

```svelte
<Button class="bg-[var(--pd-button-primary-bg)]" />
```

Color categories defined in `initColors()`: button, input, content, dialog, dropdown, etc.

### Testing Guidelines

**Use `vi.mocked()` for type-safe mocks:**

```typescript
// Good
Object.defineProperty(global, 'window', {
  value: { windowMethod: vi.fn() },
});

test('...', () => {
  vi.mocked(window.windowMethod).mockResolvedValue('a string');
});

// Bad - no type checking
const windowMethodMock = vi.fn();
windowMethodMock.mockResolvedValue({ msg: 'wrong type' });
```

**Mock complete modules, spy on specific functions:**

```typescript
import { existsSync } from 'node:fs';
import { vi } from 'vitest';

vi.mock('node:fs'); // Mock entire module

beforeEach(() => {
  vi.resetAllMocks(); // Reset to no-op before each test
});

test('file exists', () => {
  vi.mocked(existsSync).mockReturnValue(true);
  // test logic
});
```

**Use `vi.spyOn()` for partial mocking:**

```typescript
import * as helpers from './helpers.js';

beforeEach(() => {
  vi.restoreAllMocks(); // Restore original implementations
});

test('specific behavior', () => {
  vi.spyOn(helpers, 'f1').mockReturnValue(false);
  // test with mocked f1, other functions use real implementation
});
```

**Testing Library queries:**

- Use `screen.getBy*` when element must exist (throws if not found)
- Use `screen.queryBy*` followed by `expect(...).not.toBeInTheDocument()` to assert absence
- Use `screen.findBy*` for async elements

**`waitFor` vs `waitUntil`:**

```typescript
// waitFor → needs an assertion (expects exception)
await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));

// waitUntil → needs a boolean
await vi.waitUntil(() => get(imagesInfos).length > 0);
```

**Fake timers with Svelte:**

```typescript
// Always enable automatic time advancement
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
```

**Snapshots:**

- Use `toMatchSnapshot()` for large outputs (stored in `__snapshots__/` directory)
- Use `toMatchInlineSnapshot()` for small data (<10 lines, written inline)
- Update snapshots: `pnpm test <file> -u`

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

Signed-off-by: Your Name <your.email@example.com>
```

Types: `fix`, `feat`, `chore`, `docs`, `build`, `ci`, `perf`, `refactor`, `style`, `test`

Sign commits with: `git commit -s`

## Pull Request Process

For comprehensive contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

1. Run `pnpm lint-staged` to check formatting and linting
2. Ensure tests pass: `pnpm test:unit`
3. Reference issue in PR: `Closes #XXX`
4. PRs require 1 approval (2 for large code changes)
5. For large PRs, provide proof of testing (video/screenshot)
6. E2E tests must pass before merging

**Draft PRs:** CI is skipped by default. Apply `area/ci` label to trigger CI for drafts.

## Development Notes

### Monorepo Management

- Uses **pnpm workspaces** (v10.28.0)
- Workspace protocol for inter-package dependencies
- Shared configs: TypeScript, ESLint, Biome
- Build order matters: UI → Preload types → Main/Renderer → Extensions

### Build Tools

- **Vite 7**: Fast ESM-first bundler with HMR
- **TypeScript 5.9**: Strict mode enabled
- **electron-builder**: Packaging for Windows/macOS/Linux
- **Vitest**: Fast test runner with workspace support
- **Playwright**: E2E testing framework

### Key Patterns

**Dependency Injection (Main Process):**

- Uses Inversify container
- Constructor injection with `@inject()` decorators
- Interface-based dependencies

**Event System:**

- Custom `Emitter<T>` class (VS Code style)
- Type-safe event subscriptions
- Used for configuration changes, provider updates, resource changes

**IPC Communication:**

- Main → Renderer: `apiSender.send(channel, data)`
- Renderer → Main: `ipcRenderer.invoke(channel, args)`
- Type-safe wrappers in preload scripts

**Configuration:**

- JSON schema-based validation
- Scopes: global, provider, connection
- Dynamic UI generation from schemas
- File watching with Chokidar

## Platform-Specific Notes

**Linux:**

- Builds create `.flatpak` files
- Requires Flatpak dependencies: `org.flatpak.Builder`, `org.freedesktop.Platform//25.08`, `org.freedesktop.Sdk//25.08`
- Requires GNU C/C++ compiler (`gcc-c++` on Fedora/RHEL, `build-essential` on Ubuntu/Debian)

**macOS:**

- Compiled binaries in `dist/mac/` folder (ignore `arm64` and `universal` folders)
- Must ad-hoc sign before running: `codesign --force --deep --sign - "dist/mac-arm64/Podman Desktop.app"`

**Windows:**

- Requires Microsoft Visual C++ Redistributable

## Website Development

The documentation website is built with Docusaurus (located in `website/`).

See `WEBSITE_CONTRIBUTING.md` for website-specific contribution guidelines.
