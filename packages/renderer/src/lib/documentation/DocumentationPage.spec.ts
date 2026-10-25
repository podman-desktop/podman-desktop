import '@testing-library/jest-dom/vitest';

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { isDark, isHighContrast } from '/@/stores/appearance';
import { colorsInfos } from '/@/stores/colors';

import DocumentationPage from './DocumentationPage.svelte';

vi.mock(import('/@/stores/appearance'), async () => {
  const { writable } = await import('svelte/store');
  return { isDark: writable(false), isHighContrast: writable(false) };
});
vi.mock(import('/@/stores/colors'), async () => {
  const { writable } = await import('svelte/store');
  return { colorsInfos: writable([]) };
});

beforeEach(() => {
  isDark.set(false);
  isHighContrast.set(false);
});
afterEach(() => vi.restoreAllMocks());

test('preserves encoded characters in an already parsed documentation URL', () => {
  const url = 'https://podman-desktop.io/docs/a%2Fb?filter=100%25&query=a+b';
  const { container } = render(DocumentationPage, { url });
  expect(container.querySelector('webview')).toHaveAttribute('src', url);
});

test.each(['javascript:alert(1)', 'file:///etc/passwd', 'not a URL'])(
  'rejects unsupported documentation URL %s',
  url => {
    const { container, getByText } = render(DocumentationPage, { url });
    expect(container.querySelector('webview')).toBeNull();
    getByText('This documentation link is invalid.');
  },
);

test.each([
  ['light', false, false],
  ['dark', true, false],
  ['high contrast light', false, true],
  ['high contrast dark', true, true],
] as const)('synchronizes %s documentation with the app colors', async (_, dark, contrast) => {
  isDark.set(dark);
  isHighContrast.set(contrast);
  let background = dark ? 'rgb(12, 12, 12)' : 'rgb(250, 250, 250)';
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    get backgroundColor() {
      return background;
    },
    getPropertyValue: (name: string): string =>
      name === '--pd-content-text' ? (dark ? '#ffffff' : '#000000') : '#8844cc',
  } as CSSStyleDeclaration);
  const { container } = render(DocumentationPage, { url: 'https://podman-desktop.io/docs' });
  const webview = container.querySelector('webview')!;
  const executeJavaScript = vi.fn().mockResolvedValue(undefined);
  Object.assign(webview, { executeJavaScript });
  await fireEvent(webview, new Event('dom-ready'));
  expect(executeJavaScript).toHaveBeenCalled();
  let script = executeJavaScript.mock.lastCall![0] as string;
  expect(script).toContain(`"${dark ? 'dark' : 'light'}"`);
  expect(script).toContain(`--ifm-navbar-background-color: ${background}`);
  expect(script.includes('text-decoration: underline')).toBe(contrast);
  // A custom theme can change colors without changing its light/dark family.
  executeJavaScript.mockClear();
  background = 'rgb(30, 40, 50)';
  colorsInfos.set([]);
  await waitFor(() => expect(executeJavaScript).toHaveBeenCalled());
  script = executeJavaScript.mock.lastCall![0] as string;
  expect(script).toContain('--ifm-background-color: rgb(30, 40, 50)');
});
