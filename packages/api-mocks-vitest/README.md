# @podman-desktop/api-mocks-vitest

Pre-generated vitest mocks for `@podman-desktop/api`, for use in third-party Podman Desktop extension tests.

All namespaces, functions, and classes exported by `@podman-desktop/api` are mocked with `vi.fn()`.

## Usage

### 1. Install the package

```bash
pnpm add -D @podman-desktop/api-mocks-vitest
```

### 2. Configure vitest

In your `vitest.config.ts` (or `vite.config.ts`), add the alias pointing to the bundled mock file:

```ts
import { defineConfig } from 'vitest/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const apiMocksPath = require.resolve('@podman-desktop/api-mocks-vitest/@podman-desktop/api');

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@podman-desktop/api': apiMocksPath,
    },
  },
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
