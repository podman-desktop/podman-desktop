import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isDark } from '/@/stores/appearance';

import ThemedIcon from './ThemedIcon.svelte';

describe('ThemedIcon.svelte', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders nothing when icon is undefined', () => {
    const { container } = render(ThemedIcon, {
      props: {
        icon: undefined,
        alt: 'test',
      },
    });

    expect(container.querySelector('img')).toBeNull();
  });

  test('renders string icon as-is', () => {
    const { container } = render(ThemedIcon, {
      props: {
        icon: '/path/to/icon.png',
        alt: 'test icon',
      },
    });

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/path/to/icon.png');
    expect(img?.getAttribute('alt')).toBe('test icon');
  });

  test('renders dark variant in dark mode', () => {
    isDark.set(true);

    const { container } = render(ThemedIcon, {
      props: {
        icon: { light: '/light.png', dark: '/dark.png' },
        alt: 'themed icon',
      },
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/dark.png');
  });

  test('renders light variant in light mode', () => {
    isDark.set(false);

    const { container } = render(ThemedIcon, {
      props: {
        icon: { light: '/light.png', dark: '/dark.png' },
        alt: 'themed icon',
      },
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/light.png');
  });

  test('falls back to light variant when dark is missing in dark mode', () => {
    isDark.set(true);

    const { container } = render(ThemedIcon, {
      props: {
        icon: { light: '/light.png', dark: undefined },
        alt: 'themed icon',
      },
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/light.png');
  });

  test('falls back to dark variant when light is missing in light mode', () => {
    isDark.set(false);

    const { container } = render(ThemedIcon, {
      props: {
        icon: { light: undefined, dark: '/dark.png' },
        alt: 'themed icon',
      },
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/dark.png');
  });

  test('renders nothing when both variants are missing', () => {
    const { container } = render(ThemedIcon, {
      props: {
        icon: { light: undefined, dark: undefined },
        alt: 'themed icon',
      },
    });

    expect(container.querySelector('img')).toBeNull();
  });

  test('applies custom class to img element', () => {
    const { container } = render(ThemedIcon, {
      props: {
        icon: '/icon.png',
        alt: 'test',
        class: 'max-h-10 custom-class',
      },
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('class')).toBe('max-h-10 custom-class');
  });
});
