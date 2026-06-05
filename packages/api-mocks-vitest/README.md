# @podman-desktop/api-mocks-vitest

Pre-generated vitest mocks for `@podman-desktop/api`, for use in third-party Podman Desktop extension tests.

All namespaces, functions, and classes exported by `@podman-desktop/api` are mocked with `vi.fn()`.

## Usage

### 1. Install the package

```bash
pnpm add -D @podman-desktop/api-mocks-vitest
```

### 2. Configure vitest

In your `vitest.config.ts` (or `vite.config.ts`), add the plugin:

```ts
import { defineConfig } from 'vitest/config';

import { podmanDesktopApiMockPlugin } from '@podman-desktop/api-mocks-vitest/plugin';

export default defineConfig({
  plugins: [podmanDesktopApiMockPlugin()],
});
```

### 3. Write tests

```ts
import { commands, window } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';
import { activate } from './extension.js';

beforeEach(() => {
  vi.resetAllMocks();
});

test('activate registers a command', async () => {
  await activate(context);
  expect(commands.registerCommand).toHaveBeenCalledWith('my-extension.hello', expect.any(Function));
});
```
