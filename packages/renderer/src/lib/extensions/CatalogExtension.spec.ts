/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtension from './CatalogExtension.svelte';

vi.mock(import('tinro'));

beforeEach(() => {
  vi.resetAllMocks();
});

const installedExtension: CombinedExtensionInfoUI = {
  id: 'myId',
  name: 'my-extension',
  displayName: 'This is the display name',
  description: 'my description',
  publisher: 'Foo publisher',
  version: '1.0.0',
  type: 'pd',
  state: 'started',
  removable: true,
  bundled: false,
  devMode: false,
  path: '',
  readme: '',
};

const catalogExtension: CatalogExtensionInfoUI = {
  id: installedExtension.id,
  displayName: installedExtension.displayName,
  isFeatured: false,
  fetchable: true,
  fetchLink: 'myLink',
  fetchVersion: '1.0.0',
  publisherDisplayName: installedExtension.publisher,
  isInstalled: false,
  shortDescription: installedExtension.description,
  categories: [],
  keywords: [],
};

test('details is a native link that navigates and notifies exactly once', async () => {
  const ondetails = vi.fn();
  const oninstall = vi.fn();
  render(CatalogExtension, { catalogExtensionUI: catalogExtension, ondetails, oninstall });
  const card = screen.getByRole('group', { name: catalogExtension.displayName });
  const detailsLink = within(card).getByRole('link', { name: catalogExtension.displayName });
  expect(detailsLink).toHaveAttribute('href', '/extensions/details/myId/');
  expect(detailsLink).toHaveAttribute('data-tinro-ignore');
  expect(detailsLink).not.toHaveAttribute('tabindex');
  expect(within(card).getAllByRole('link')).toHaveLength(1);
  expect(screen.queryByRole('button', { name: /More details/ })).not.toBeInTheDocument();
  expect(detailsLink).not.toContainElement(screen.getByRole('button', { name: 'Install myId Extension' }));

  expect(await fireEvent.click(detailsLink)).toBe(false);
  expect(vi.mocked(router.goto)).toHaveBeenCalledExactlyOnceWith('/extensions/details/myId/');
  expect(ondetails).toHaveBeenCalledExactlyOnceWith('myId');
  expect(oninstall).not.toHaveBeenCalled();
  expect(window.extensionInstallFromImage).not.toHaveBeenCalled();
});

test('the publisher retains its tooltip and activates the same details link', async () => {
  const ondetails = vi.fn();
  render(CatalogExtension, { catalogExtensionUI: catalogExtension, ondetails });
  const detailsLink = screen.getByRole('link', { name: catalogExtension.displayName });
  const publisher = within(detailsLink).getByText(catalogExtension.publisherDisplayName);
  expect(publisher).toHaveAttribute('title', catalogExtension.publisherDisplayName);

  await fireEvent.click(publisher);
  expect(vi.mocked(router.goto)).toHaveBeenCalledExactlyOnceWith('/extensions/details/myId/');
  expect(ondetails).toHaveBeenCalledExactlyOnceWith('myId');
});

test('tabs to details before install and activates each independently using the keyboard', async () => {
  const user = userEvent.setup();
  const ondetails = vi.fn();
  const oninstall = vi.fn();
  render(CatalogExtension, { catalogExtensionUI: catalogExtension, ondetails, oninstall });
  const detailsLink = screen.getByRole('link', { name: catalogExtension.displayName });
  const installButton = screen.getByRole('button', { name: 'Install myId Extension' });

  await user.tab();
  expect(detailsLink).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(vi.mocked(router.goto)).toHaveBeenCalledExactlyOnceWith('/extensions/details/myId/');
  expect(ondetails).toHaveBeenCalledExactlyOnceWith('myId');
  expect(oninstall).not.toHaveBeenCalled();

  await user.tab();
  expect(installButton).toHaveFocus();
  await user.keyboard(' ');
  expect(oninstall).toHaveBeenCalledExactlyOnceWith('myId');
  expect(window.extensionInstallFromImage).toHaveBeenCalledOnce();
  expect(vi.mocked(router.goto)).toHaveBeenCalledOnce();
  expect(ondetails).toHaveBeenCalledOnce();
});

test.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }])(
  'does not invoke details for modified or non-primary clicks: %o',
  async clickOptions => {
    const ondetails = vi.fn();
    render(CatalogExtension, { catalogExtensionUI: catalogExtension, ondetails });
    const detailsLink = screen.getByRole('link', { name: catalogExtension.displayName });

    expect(await fireEvent.click(detailsLink, clickOptions)).toBe(true);
    expect(ondetails).not.toHaveBeenCalled();
    expect(vi.mocked(router.goto)).not.toHaveBeenCalled();
  },
);

test.each([
  { name: 'installed', catalogExtensionUI: { ...catalogExtension, isInstalled: true, installedExtension } },
  { name: 'not fetchable', catalogExtensionUI: { ...catalogExtension, fetchable: false } },
])('keeps the details link without an install control: $name', async ({ catalogExtensionUI }) => {
  const user = userEvent.setup();
  render(CatalogExtension, { catalogExtensionUI });

  await user.tab();
  expect(screen.getByRole('link', { name: catalogExtension.displayName })).toHaveFocus();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('Expect to see featured and fetch button', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: true,
    fetchable: true,
    fetchLink: 'myLink',
    fetchVersion: '',
    publisherDisplayName: 'Foo publisher',
    isInstalled: false,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
  };

  const oninstall = vi.fn();
  const ondetails = vi.fn();
  render(CatalogExtension, { catalogExtensionUI, oninstall, ondetails });

  // get div using aria-label 'This is the display name'
  const extensionWidget = screen.getByRole('group', { name: 'This is the display name' });

  expect(extensionWidget).toBeInTheDocument();

  // check featured is inside
  const featured = screen.getByText('Featured');
  expect(featured).toBeInTheDocument();

  // get install button
  const installButton = screen.getByRole('button', { name: 'Install myId Extension' });
  expect(installButton).toBeInTheDocument();

  // click the button
  await fireEvent.click(installButton);

  expect(oninstall).toHaveBeenCalledExactlyOnceWith('myId');
  expect(ondetails).not.toHaveBeenCalled();
  expect(vi.mocked(router.goto)).not.toHaveBeenCalled();
  expect(vi.mocked(window.extensionInstallFromImage)).toHaveBeenCalledExactlyOnceWith(
    'myLink',
    expect.any(Function),
    expect.any(Function),
    'myId',
  );
});

test('Expect to have version of installed one', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    installedVersion: '2.0.0',
    publisherDisplayName: 'Foo publisher',
    isInstalled: true,
    installedExtension: { ...installedExtension, version: '2.0.0' },
    shortDescription: 'my description',
    categories: [],
    keywords: [],
  };

  render(CatalogExtension, { catalogExtensionUI });

  // check catalog version is displayed
  const catalogVersion = screen.getByText('v1.0.0');
  expect(catalogVersion).toBeInTheDocument();

  // check if installed version is displayed
  const installedVersion = screen.getByText('(installed: v2.0.0)');
  expect(installedVersion).toBeInTheDocument();
  within(screen.getByRole('status', { name: 'Extension status' })).getByText('Installed');
});

test.each([
  ['started', 'Installed'],
  ['stopped', 'Disabled'],
  ['failed', 'Failed'],
  ['starting', 'Enabling'],
  ['stopping', 'Disabling'],
])('renders shared lifecycle status for %s without an installed checkmark', (state, label) => {
  const { container } = render(CatalogExtension, {
    catalogExtensionUI: {
      ...catalogExtension,
      isInstalled: true,
      installedExtension: { ...installedExtension, state },
    },
  });

  const status = screen.getByRole('status', { name: 'Extension status' });
  within(status).getByText(label);
  expect(screen.queryByText('Already installed')).not.toBeInTheDocument();
  expect(container.querySelector('[data-icon="circle-check"]')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Install myId Extension' })).not.toBeInTheDocument();
});

test('reacts to installation, lifecycle changes and removal', async () => {
  const { rerender } = render(CatalogExtension, { catalogExtensionUI: catalogExtension });

  screen.getByRole('button', { name: 'Install myId Extension' });
  expect(screen.queryByRole('status', { name: 'Extension status' })).not.toBeInTheDocument();

  for (const [state, label] of [
    ['starting', 'Enabling'],
    ['started', 'Installed'],
    ['stopping', 'Disabling'],
    ['stopped', 'Disabled'],
    ['failed', 'Failed'],
  ]) {
    await rerender({
      catalogExtensionUI: {
        ...catalogExtension,
        isInstalled: true,
        installedExtension: { ...installedExtension, state },
      },
    });
    within(screen.getByRole('status', { name: 'Extension status' })).getByText(label);
    expect(screen.queryByRole('button', { name: 'Install myId Extension' })).not.toBeInTheDocument();
  }

  await rerender({ catalogExtensionUI: catalogExtension });
  screen.getByRole('button', { name: 'Install myId Extension' });
  expect(screen.queryByRole('status', { name: 'Extension status' })).not.toBeInTheDocument();
});

test('reactively shows the featured indicator beside the name, not a banner or verification claim', async () => {
  const { rerender } = render(CatalogExtension, { catalogExtensionUI: catalogExtension });
  expect(screen.queryByText('Featured', { exact: true })).not.toBeInTheDocument();

  await rerender({ catalogExtensionUI: { ...catalogExtension, isFeatured: true } });
  const featured = screen.getByText('Featured', { exact: true });
  expect(featured).toHaveClass('text-(--pd-content-header)', 'border-(--pd-content-header)');
  expect(featured).not.toHaveAttribute('role');
  expect(featured).not.toHaveAttribute('aria-label');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.queryByTestId('tooltip-trigger')).not.toBeInTheDocument();
  expect(screen.getByText(catalogExtension.displayName).parentElement).toContainElement(featured);
  screen.getByText(catalogExtension.publisherDisplayName);
  expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();

  await rerender({ catalogExtensionUI: catalogExtension });
  expect(screen.queryByText('Featured', { exact: true })).not.toBeInTheDocument();
});

test('does not infer verification from catalog publisher or categories', () => {
  render(CatalogExtension, {
    catalogExtensionUI: {
      ...catalogExtension,
      publisherDisplayName: 'Red Hat',
      categories: ['Verified'],
    },
  });
  expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();
});
