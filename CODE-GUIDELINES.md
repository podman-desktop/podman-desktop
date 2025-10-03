# Guidelines for Podman Desktop Code

## General Principles:
Consistency is key - adhere to a consistent style throughout the codebase. 
Readability - prioritize clear and easy-to-understand code. 
Maintainability - write code that is easy to modify and update. 

## Production code

### File Naming:
Use descriptive names for files and directories. 
Follow consistent capitalization (e.g., PascalCase for classes, camelCase for variables) 

### Naming Conventions:
### Variables:
Use camelCase for variables 
Use meaningful names that clearly describe their purpose 
### Functions:
Use camelCase for function names 
Clearly describe the action performed by the function 
### Classes:
Use PascalCase for class names 
### Indentation and Spacing:
Use consistent indentation (usually 4 spaces) 
Avoid unnecessary spaces within lines 
### Commenting:
Use clear and concise comments to explain complex logic or non-obvious code sections 
Update comments when modifying the code 
### Code Style:
#### Line Length: 
Limit lines to a specific character count (e.g., 80 characters) for readability 
#### Braces: 
Consistent placement of opening and closing braces 
### Language Specific Guidelines:
### TypeScript:
Follow standard JavaScript style conventions
### Svelte
defer the code of the html to the javascript for the click/change/etc handler

ie:
do not do: ....on:click={() => lof of code here}

introduce a function in the script part and just call it in the handler
on:click={theMethod}




## Unit tests code

### Svelte 5 Mocking Tests

Do not use hoisted, its's not require for 99% of the cases

#### Try { } catch
We should never use try catch in *.spec.ts file. As we aim for deterministic tests, vitest provide us tools, and method to expect for errors.

test('expect error to be properly catched and verified', async () => {
  await expect(async () => {
    // replace Promise.reject by the async method you want to call that will
    // throw an error
    await Promise.reject(new Error('Dummy Error'));
  }).rejects.toThrowError('Dummy Error');
});

#### Avoid using screen global
When we want to getByRole an HTML element when testing we use the screen from @testing-library/svelte but here is an altertive I like

- import { render, screen } from '@testing-library/svelte';
+ import { render } from '@testing-library/svelte';

test('render something', async () => {
-  render(Link);
+  const { getByRole } = render(Link);
-  const element = screen.getByRole('link');
+  const element = getByRole('link');
  expect(link).toBeInTheDocument();
});
We have access to all the function that are available on the screen.

#### Declaring props
It is easier and nice to read to have a multi line interface named Props.

- let { varA, varB }: { varA: string, varB: boolean } = $props();
+ interface Props {
+    varA: string;
+   varB: boolean;
+ }
+ let { varA, varB }: Props  = $props();
This is recommended inside the official documentation typescript#Typing-$props

#### Advanced HTML element genericity
We may need to catch some of the HTML default attribute element, please do not add them to the Props interface: we can do better! Let's say I need to allow parent component to provide any html attribute.

<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
  varA?: number;
}

let { varA, ...restProps }: Props = $props();
</script>

<div {...restProps}>{varA}</div>


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
