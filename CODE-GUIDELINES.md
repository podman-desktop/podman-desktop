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
