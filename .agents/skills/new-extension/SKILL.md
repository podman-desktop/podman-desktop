---
name: new-extension
description: >-
  Scaffold a new Podman Desktop extension as a standalone repository with all
  required boilerplate, build config, Containerfile, and Svelte webview. Use
  when the user asks to create a new extension, add extension boilerplate,
  scaffold an extension, or bootstrap a Podman Desktop extension project.
---

# Create a New Podman Desktop Extension

Scaffold a standalone extension in its own repository. The user provides an extension name and a brief description of what it should do. You produce all required files and verify the extension builds and can be loaded locally into Podman Desktop.

## Inputs

Ask the user (or infer from context):

1. **Extension name** — kebab-case identifier (e.g. `apple-container`). Used as the directory/repo name and the `name` field in `package.json`.
2. **Display name** — human-readable title (e.g. `Apple Container`).
3. **Description** — one-sentence summary shown in the extension list.
4. **Feature scope** — what the extension should do. Common patterns:
   - **Minimal** — register a command, show a notification
   - **Webview** — display a Svelte UI panel (this is the default for any extension that shows content)
   - **Provider** — register a container engine or Kubernetes provider
   - **Status bar / Tray** — add status bar entries or tray menu items
   - **Configuration** — add extension-specific settings
   - Combinations of the above
5. **Publisher** — the org or username that owns the extension (default: the user's GitHub username).

If the extension needs to display any UI beyond simple notifications, **always use the multi-package webview layout** (not inline HTML). This is the standard for all production Podman Desktop extensions.

---

## Where to look in the Podman Desktop codebase

When implementing extension features, you may need to look up API details:

| What you need                                                                             | Where to look                                                                       |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Full extension API types (`createWebviewPanel`, `containerEngine`, `provider`, etc.)      | `packages/extension-api/src/extension-api.d.ts` in the podman-desktop repo          |
| Extension manifest schema (what `contributes` fields exist)                               | `packages/main/src/plugin/extension/extension-manifest-schema.ts`                   |
| How the extension loader discovers and activates extensions                               | `packages/main/src/plugin/extension/extension-loader.ts`                            |
| Container operations (`createContainer`, `startContainer`, `pullImage`, `listContainers`) | Search for `export namespace containerEngine` in `extension-api.d.ts`               |
| Provider operations (`createProvider`, `getContainerConnections`)                         | Search for `export namespace provider` in `extension-api.d.ts`                      |
| Webview types (`WebviewPanel`, `Webview`, `WebviewOptions`)                               | Search for `interface WebviewPanel` in `extension-api.d.ts`                         |
| Container create options (`Image`, `Cmd`, `HostConfig`, `PortBindings`, `ExposedPorts`)   | Search for `interface ContainerCreateOptions` in `extension-api.d.ts`               |
| Existing built-in extensions as examples                                                  | `extensions/` directory (e.g. `extensions/registries/`, `extensions/kube-context/`) |
| How extensions are published to OCI registries                                            | `website/docs/extensions/publish/index.md`                                          |

---

## Step 1 — Choose layout

### Minimal (no UI)

For extensions that only register commands, providers, status bar items, or configuration — no webview needed.

```
{name}/
├── .gitignore
├── Containerfile
├── LICENSE
├── README.md
├── icon.png
├── package.json
├── tsconfig.json
└── src/
    └── extension.ts
```

### Multi-package with Svelte webview (default for any UI)

**Always use this layout when the extension displays content.** Do not use inline HTML strings. The frontend is a Svelte app built by Vite into static assets that the backend loads into a webview panel.

```
{name}/
├── .gitignore
├── Containerfile
├── LICENSE
├── README.md
├── package.json                       # root workspace — runs both packages
├── packages/
│   ├── backend/                       # the extension entry point (Node.js)
│   │   ├── icon.png
│   │   ├── package.json               # has "main": "./dist/extension.js"
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       └── extension.ts
│   ├── frontend/                      # Svelte app built into backend/media/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── svelte.config.js
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── main.ts
│   │       └── App.svelte
│   └── shared/                        # (optional) shared types between frontend & backend
│       └── src/
│           └── ...
```

---

## Step 2 — File contents (multi-package webview)

### .gitignore

```
dist/
media/
node_modules/
```

`media/` is a build artifact (frontend output) — do not commit it.

### Root package.json

```json
{
  "name": "{name}",
  "displayName": "{displayName}",
  "description": "{description}",
  "version": "0.0.1",
  "private": true,
  "engines": { "node": ">=22.0.0", "npm": ">=11.0.0" },
  "scripts": {
    "build": "concurrently \"npm run -w packages/frontend build\" \"npm run -w packages/backend build\"",
    "watch": "concurrently \"npm run -w packages/frontend watch\" \"npm run -w packages/backend watch\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.9.3",
    "vite": "^7.0.0"
  },
  "workspaces": ["packages/*"]
}
```

> **Vite version constraint:** `@sveltejs/vite-plugin-svelte@6.x` requires Vite 6 or 7. Do not use Vite 8+.

### packages/backend/package.json

This is the **extension manifest** that Podman Desktop reads:

```json
{
  "name": "{name}",
  "displayName": "{displayName}",
  "description": "{description}",
  "version": "0.0.1",
  "icon": "icon.png",
  "publisher": "{publisher}",
  "license": "Apache-2.0",
  "engines": { "podman-desktop": ">=1.26.0" },
  "main": "./dist/extension.js",
  "contributes": {},
  "scripts": {
    "build": "vite build",
    "watch": "vite --mode development build -w"
  },
  "devDependencies": {
    "@podman-desktop/api": "^1.26.1",
    "@types/node": "^22"
  }
}
```

### packages/backend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "lib": ["ES2020"],
    "sourceMap": true,
    "rootDir": "src",
    "outDir": "dist",
    "skipLibCheck": true,
    "types": ["node"],
    "strict": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"]
}
```

### packages/backend/vite.config.ts

Use `.ts` for type-safe config. The backend builds as a CJS library entry point with `@podman-desktop/api` and all Node builtins externalized.

```ts
import { join } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: 'esnext',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'production' ? 'esbuild' : false,
    lib: {
      entry: 'src/extension.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['@podman-desktop/api', ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: { entryFileNames: '[name].js' },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
```

### packages/frontend/package.json

```json
{
  "name": "frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "watch": "vite --mode development build -w"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^6.1.0",
    "svelte": "^5.53.5"
  }
}
```

Optionally add `@podman-desktop/ui-svelte` for native Podman Desktop components (Button, EmptyScreen, etc.), and `tailwindcss` + `autoprefixer` + `postcss` if you want Tailwind styling.

### packages/frontend/tsconfig.json

The frontend runs in a browser-like webview environment, so it needs DOM libs and bundler resolution:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src"]
}
```

### packages/frontend/svelte.config.js

Required for Svelte preprocessing (TypeScript in `.svelte` files):

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: [vitePreprocess()],
};
```

### packages/frontend/vite.config.ts

The key: `outDir: '../backend/media'` — Vite builds the Svelte app into the backend's `media/` folder.

```ts
import { join } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(filename);

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: { '/@/': join(PACKAGE_ROOT, 'src') + '/' },
  },
  plugins: [svelte()],
  base: '',
  build: {
    sourcemap: true,
    outDir: '../backend/media',
    assetsDir: '.',
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
```

### packages/frontend/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{displayName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

### packages/frontend/src/main.ts

```ts
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.getElementById('app')! });
export default app;
```

### packages/frontend/src/App.svelte

Write the Svelte component for the extension's UI. Use `@podman-desktop/ui-svelte` components (Button, EmptyScreen, etc.) for a native look and feel.

---

## Step 3 — Backend loads the built frontend

In `packages/backend/src/extension.ts`, the backend creates a webview panel and loads the Svelte-built `index.html` from `media/`:

```ts
import type { ExtensionContext } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import fs from 'node:fs';

export async function activate(extensionContext: ExtensionContext): Promise<void> {
  const panel = extensionApi.window.createWebviewPanel('{name}-panel', '{displayName}', {
    localResourceRoots: [extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media')],
  });
  extensionContext.subscriptions.push(panel);

  const indexHtmlUri = extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', 'index.html');
  let indexHtml = await fs.promises.readFile(indexHtmlUri.fsPath, 'utf8');

  // Rewrite asset paths so the webview can load them
  const scriptLinks = indexHtml.match(/<script[^>]+src="([^"]+)"/g) ?? [];
  for (const link of scriptLinks) {
    const src = link.match(/src="([^"]+)"/)?.[1];
    if (src) {
      const webviewUri = panel.webview.asWebviewUri(
        extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', src),
      );
      indexHtml = indexHtml.replace(src, webviewUri.toString());
    }
  }
  const cssLinks = indexHtml.match(/<link[^>]+href="([^"]+)"/g) ?? [];
  for (const link of cssLinks) {
    const href = link.match(/href="([^"]+)"/)?.[1];
    if (href) {
      const webviewUri = panel.webview.asWebviewUri(
        extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', href),
      );
      indexHtml = indexHtml.replace(href, webviewUri.toString());
    }
  }

  panel.webview.html = indexHtml;
}

export async function deactivate(): Promise<void> {
  console.log('stopping {name} extension');
}
```

**Why this approach?** The webview runs in a sandboxed iframe with its own origin. Local file paths don't resolve — you must convert them with `panel.webview.asWebviewUri()` and set `localResourceRoots` to grant access to the `media/` folder.

### Backend-to-frontend messaging

The backend can send messages to the frontend with `postMessage`, and the frontend listens with `window.addEventListener('message', ...)`:

**Backend** (in extension.ts):

```ts
panel.webview.postMessage({ type: 'status', value: 'running' });
```

**Frontend** (in App.svelte):

```svelte
<script lang="ts">
  let status = $state('idle');

  window.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'status') {
      status = event.data.value;
    }
  });
</script>
```

The frontend can also send messages back to the backend using `acquirePodmanDesktopApi().postMessage()`, and the backend receives them via `panel.webview.onDidReceiveMessage`. See the [full template](https://github.com/podman-desktop/podman-desktop-extension-full-template) for a complete RPC implementation using `MessageProxy`.

---

## Step 4 — Containerfile (multi-package)

```dockerfile
FROM scratch AS builder
COPY packages/backend/dist/ /extension/dist
COPY packages/backend/package.json /extension/
COPY packages/backend/media/ /extension/media
COPY packages/backend/icon.png /extension/
COPY LICENSE /extension/
COPY README.md /extension/

FROM scratch

LABEL org.opencontainers.image.title="{displayName}" \
      org.opencontainers.image.description="{description}" \
      org.opencontainers.image.vendor="{publisher}" \
      io.podman-desktop.api.version=">= 1.26.0"

COPY --from=builder /extension /extension
```

The OCI image copies from `packages/backend/` (the extension manifest lives there), plus the `media/` folder that contains the built frontend assets.

---

## Step 5 — Build and verify

```bash
npm install
npm run build
```

After building, verify:

- `packages/backend/dist/extension.js` exists (the backend)
- `packages/backend/media/index.html` exists (the built frontend)

---

## Step 6 — Test locally in Podman Desktop

1. Open Podman Desktop
2. Go to **Settings > Preferences > Extensions** and enable **Development mode**
3. Go to **Extensions > Local Extensions** tab
4. Click **Add a local folder extension...** and select the folder containing the extension `package.json`:
   - **Multi-package layout:** select `packages/backend/` (not the root)
   - **Minimal layout:** select the repository root
5. Verify the extension appears as `ACTIVE`
6. Test the extension's functionality

---

## Step 7 — Package and publish (when ready)

```bash
npm run build
podman build -t quay.io/{publisher}/{name} .
podman push quay.io/{publisher}/{name}
```

To add it to the official catalog, open a PR on [podman-desktop-catalog](https://github.com/podman-desktop/podman-desktop-catalog) adding the extension to `static/api/extensions.json`.

---

## Minimal extension (no webview)

For extensions without a UI panel, use the single-package layout from Step 1. Same `package.json` / `vite.config.ts` patterns as the backend package, minus the `media/` loading.

---

## Quick reference — common API patterns

| Task                            | API                                                                   |
| ------------------------------- | --------------------------------------------------------------------- |
| Show info/warning/error message | `extensionApi.window.showInformationMessage(msg)`                     |
| Register a command              | `extensionApi.commands.registerCommand(id, callback)`                 |
| Create a provider               | `extensionApi.provider.createProvider(options)`                       |
| Create a webview                | `extensionApi.window.createWebviewPanel(viewType, title, options)`    |
| Send message to webview         | `panel.webview.postMessage(data)`                                     |
| Receive message from webview    | `panel.webview.onDidReceiveMessage(callback)`                         |
| Add status bar item             | `extensionApi.window.createStatusBarItem()`                           |
| Add tray menu item              | `extensionApi.tray.registerMenuItem(item)`                            |
| Read configuration              | `extensionApi.configuration.getConfiguration(section)`                |
| Pull a container image          | `extensionApi.containerEngine.pullImage(connection, image, callback)` |
| Create a container              | `extensionApi.containerEngine.createContainer(engineId, options)`     |
| Start/stop a container          | `extensionApi.containerEngine.startContainer(engineId, id)`           |
| List containers                 | `extensionApi.containerEngine.listContainers()`                       |
| Get running engine connection   | `extensionApi.provider.getContainerConnections()`                     |
| Get engine ID from connection   | `extensionApi.containerEngine.listInfos({ provider: connection })`    |
| Navigate to webview             | `extensionApi.navigation.navigateToWebview(webviewId)`                |

---

## Common pitfalls

### Getting the `engineId` for container operations

Many `containerEngine` methods (`createContainer`, `startContainer`, `stopContainer`, `deleteContainer`, `inspectContainer`) require an `engineId` string. This is **not** `connection.name` from `getContainerConnections()` — that will produce a "no engine matching this container" error.

The correct way to obtain the `engineId`:

```ts
const connections = extensionApi.provider.getContainerConnections();
const running = connections.filter(c => c.connection.status() === 'started');
if (running.length === 0) {
  throw new Error('No running container engine found');
}
const connection = running[0].connection;

// Use listInfos to get the real engineId
const infos = await extensionApi.containerEngine.listInfos({ provider: connection });
if (infos.length === 0) {
  throw new Error('No engine info available');
}
const engineId = infos[0].engineId;

await extensionApi.containerEngine.createContainer(engineId, {
  /* ... */
});
```

Alternatively, if you already have containers or images from `listContainers()` or `listImages()`, their `engineId` field can be reused directly.

### `createContainer` auto-starts by default

`ContainerCreateOptions.start` defaults to `true`. If you call `createContainer` followed by `startContainer`, the second call will fail with **HTTP 304** ("container already started"). Either:

- Rely on the default and skip `startContainer`, or
- Pass `start: false` in the create options if you need to configure the container before starting it

For the full API surface, see [`extension-api.d.ts`](https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts).

## Official templates

- **Minimal:** [podman-desktop-extension-minimal-template](https://github.com/podman-desktop/podman-desktop-extension-minimal-template)
- **Webview (inline HTML):** [podman-desktop-extension-webview-template](https://github.com/podman-desktop/podman-desktop-extension-webview-template)
- **Full (Svelte + Tailwind + multi-package):** [podman-desktop-extension-full-template](https://github.com/podman-desktop/podman-desktop-extension-full-template) — this is the recommended starting point for any extension with a UI.
