# Guidelines for Podman Desktop Code

## Production code

### Imports

Prefer using path aliases for all cross-directory imports to improve readability and maintainability.

**Good:**

```typescript
import type { WSL2Check } from '/@/checks/windows/wsl2-check';
import { WinPlatform } from './win-platform';
```

**Bad:**

```typescript
import type { WSL2Check } from '../checks/windows/wsl2-check';
```

### Parsing route parameters

The `Route` component provides to its children a `meta` property, containing the route parameters as `string` values.

When a `requestParser` function is provided, the `Route` component also provides to its children a `request` property getting its value and type from the result of the `requestParser` function.

**Use meta:**

```ts
<Route path="/path/:optionalId" let:meta>
  <ChildView id={meta.params.optionalId} />
</Route>
```

**Use request:**

```ts
<Route path="/path/:id/*" requestParser={parseParamId} let:request>
  {#if request}
    <ChildView id={request.id} />
  {/if}
</Route>
```

```ts
function parseParamId(request: { params?: Record<string, string> }): { id: number } | undefined {
  if (!request.params?.id) {
    return undefined;
  }
  const id = parseInt(request.params.id);
  if (Number.isNaN(id)) {
    return undefined;
  }
  return { id };
}
```

## Unit tests code

### Use `vi.mocked`, not a generic `myFunctionMock`

If you define a mock with `const myFunctionMock = vi.fn();` its type is `Mock<Procedure>`, which is a generic type.

For example, do not write this, or Typescript won't be able to detect that you passed an object instead of a string to `mockResolvedValue`:

```ts
const windowMethodMock = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    windowMethod: windowMethodMock,
  },
});

test('...', () => {
  windowMethodMock.mockResolvedValue({ msg: 'a string' }); // here, Typescript is not able to detect that the type is wrong
});
```

Instead, you can write `vi.mocked(window.windowMethod).mock...`, and Typescript will check that you correctly pass a string to `mockResolvedValue`:

```ts
Object.defineProperty(global, 'window', {
  value: {
    windowMethod: vi.fn(),
  },
});

test('...', () => {
  vi.mocked(window.windowMethod).mockResolvedValue('a string');
});
```

### Mock complete modules, spy on parts of module for specific tests

When testing a module, you have to decide for each imported module if you mock the entire module or if you spy on specific functions of the module
for specific tests and keep the real implementation for the other functions.

System modules (`node:fs`, etc) are most generally mocked, so you are sure that unit tests are executed in isolation of the system. For internal modules,
it's up to you to decide if you want to mock them or not, depending on the coverage you want for the unit tests.

#### Mock a complete module

Mock completely an imported module with `vi.mock('/path/to/module)`, and define mock implementation for each test with `vi.mocked(function).mock...()`.

Use `vi.resetAllMocks()` in the top-level `beforeEach` to reset all mocks to a no-op function returning `undefined` before to start each test.

```ts
import { existsSync } from 'node:fs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// completely mock the fs module, to be sure to
// run the tests in complete isolation from the filesystem
vi.mock('node:fs');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('the file exists', () => {
  beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(true);
  });

  test('file exists', () => {
    // existsSync is mocked to return true
    expect(codeCheckingIfFileExists('/file/not/found')).toBeTruthy();
  });
});

describe('the file does not exist', () => {
  beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(false);
  });

  test('root does not exists', () => {
    // existsSync is mocked to return false
    expect(codeCheckingIfFileExists('/')).toBeFalsy();
  });
});

test('file existence is not defined', () => {
  // a no-op mock returning undefined is called
  expect(codeCheckingIfFileExists('/file/not/found')).toBeUndefined();
});
```

#### Spy on a function for a specific test

When you want to mock only one or a small number of functions of a module (for example a function of the module you are testing, or a function of an helper module from which you want to use real implementation for some functions) for a particular test, you can use `vi.spyOn(module, 'function')` to mock only `function` and keep the original implementation for the rest of the module.

To be sure that the spied function is restored to its original implementation for the other tests, use `vi.restoreAllMocks()` in the top-level `beforeEach`.

```ts
// helpers.ts
export function f1(): boolean {
  return true;
}

// mymodule.ts
import { f1 } from './helpers.js';

export class MyModuleToTest {
  f2(): boolean {
    return f1();
  }
}

// mymodule.spec.ts
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MyModuleToTest } from './mymodule.js';
import * as helpers from './helpers.js';

let myModuleToTest: MyModuleToTest;

beforeEach(() => {
  myModuleToTest = new MyModuleToTest();

  // restore f1 to its original implementation
  vi.restoreAllMocks();
});

describe('f1 returns false', () => {
  beforeEach(() => {
    vi.spyOn(helpers, 'f1').mockReturnValue(false);
  });

  test('f2 returns false', () => {
    expect(myModuleToTest.f2()).toBeFalsy();
    expect(helpers.f1).toHaveBeenCalledOnce();
  });
});

test('f2 returns true', () => {
  // use the original implementation of f1
  expect(myModuleToTest.f2()).toBeTruthy();
  // this won't work, as f1 is not spied for this test
  // expect(helpers.f1).toHaveBeenCalledOnce();
});
```

### screen.getBy vs screen.queryBy

Calling `element = screen.getBy...` throws an error if no element is found.
For this reason, it is not necessary to call `expect(element).toBeInTheDocument()`, as the assertion
has already been done as part of `screen.getBy...`.

It is necessary to use `element = screen.queryBy...` followed by `expect(element).not.toBeInTheDocument()`
when checking if a component does NOT exist, as this call does not throw any error,
but returns a `null` value if the element is not found.

### Testing style attribute

When we need to ensure a given style is applied to an HTMLElement, we should be using [tohavestyle](https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavestyle)

#### Examples

```ts
const { getByText } = render(<MyComponent>);

const text = getByText('text in the page');
// [Good]
expect(text).toHaveStyle({ color: '#FFFFF'});
```

### Mocking a sub-component

To test a component in isolation without testing its sub-components, you have the possibility to mock
the sub-components. For example:

Compo1.svelte

```typescript
<script lang="ts">
import Compo2 from './Compo2.svelte';
</script>

<Compo2 />
```

Compo2.svelte

```typescript
Some content
```

Compo1.spec.ts

```typescript
import { render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import Compo1 from './Compo1.svelte';
import Compo2 from './Compo2.svelte';

vi.mock(import('./Compo2.svelte'));

test('Compo1 calls Compo2', async () => {
  render(Compo1);
  expect(Compo2).toHaveBeenCalled();
});
```

#### When the sub-components have bindable properties

When a sub-component has a bindable property, you may want to test that
some operations are performed on this property.
But as the property value is returned by the sub-component, which is now mocked, you have to return such an object when you mock the component.

For this, you can mock the implementation of the sub-component constructor, and update
the bound property passed as parameter with an object for which you can spy the methods. For example:

Compo1.svelte

```typescript
<script lang="ts">
import { onMount } from 'svelte';
import type { Obj } from './compo2';
import Compo2 from './Compo2.svelte';

let myobj = $state<Obj>();

onMount(() => {
  myobj?.fct1('a name');
});
</script>

<Compo2 bind:obj={myobj} />
```

Compo2.svelte

```typescript
<script lang="ts">
import type { Obj } from './compo2';

interface Props {
  obj?: Obj;
}

let { obj = $bindable() }: Props = $props();
</script>
```

compo2.ts

```typescript
export interface Obj {
  fct1: (name: string) => void;
}
```

Compo1.spec.ts

```typescript
import { render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import Compo1 from './Compo1.svelte';
import type { Obj } from './compo2';
import Compo2 from './Compo2.svelte';

vi.mock(import('./Compo2.svelte'));

test('compo1 calls fct1 of obj on mount', async () => {
  // create a mock Obj, with methods you can spy
  const obj: Obj = {
    fct1: vi.fn(),
  };
  vi.mocked(Compo2).mockImplementation((_, props) => {
    props.obj = obj; // update the value of the prop with your mock Obj
    return {};
  });
  render(Compo1);
  expect(Compo2).toHaveBeenCalled();
  expect(obj.fct1).toHaveBeenCalledWith('a name'); // check the method has been called
});
```

### Using Fake Timers with Svelte Components

When testing Svelte components in the `packages/renderer` package, **always enable automatic time advancement** by using:

```ts
vi.useFakeTimers({ shouldAdvanceTime: true });
```

Avoid calling `vi.useFakeTimers()` without options.

If `shouldAdvanceTime` is not enabled, fake timers will **completely freeze time**, which can lead to deadlocks when:

- Svelte’s internal async updates wait for the next event loop tick
- Testing Library’s async queries (`findBy*`, `waitFor`) continuously poll for elements

By setting `shouldAdvanceTime: true`, timers will automatically advance during pending async operations. This prevents hangs while still allowing manual time control with `vi.advanceTimersByTime()`.

✅ **Use this pattern:**

```ts
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
```

🚫 **Instead of:**

```ts
afterEach(() => {
  vi.useRealTimers();
});
```
