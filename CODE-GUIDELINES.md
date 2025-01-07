# Guidelines for Podman Desktop Code

## Production code

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

### Mock before tests, not during tests

If you need to mock functions for some tests, execute the mock from the `beforeEach` callback inside a `describe`,
so the environment is clearly defined in the `describe` and the `test` is only executing the tests:

Do not write:

```ts
vi.mock('node:fs');

test('first behaviour', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  codeToTest();
  expect(...);
});

test('second behaviour', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  otherCodeToTest();
  expect(...);
});
```

Instead, write:

```ts
vi.mock('node:fs');

describe('the file exists', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
  });

  test('first behaviour', () => {
    codeToTest();
    expect(...);
  });

  test('second behaviour', () => {
    otherCodeToTest();
    expect(...);
  });
});
```
