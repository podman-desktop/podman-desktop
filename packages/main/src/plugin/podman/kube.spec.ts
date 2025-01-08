import { expect, test } from 'vitest';

import { getImageNamePrefix } from '/@/plugin/podman/kube.js';

test.each([
  {
    image: 'foobar',
    expected: 'foobar',
  },
  {
    image: 'foobar:latest',
    expected: 'foobar',
  },
  {
    image: 'foo/bar:latest',
    expected: 'bar',
  },
  {
    image: 'aa/bb/cc:latest',
    expected: 'cc',
  },
  {
    image: 'foo/bar',
    expected: 'bar',
  },
  {
    image: 'foo@bar',
    expected: 'foo',
  },
  {
    image: 'foo@bar:latest',
    expected: 'foo',
  },
])('expect $image to be $expected', ({ image, expected }) => {
  const result = getImageNamePrefix(image);
  expect(result).toBe(expected);
});
