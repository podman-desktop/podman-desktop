/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { WebviewInfo } from '@podman-desktop/core-api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  dismissExtensionNavPointer,
  extensionNavPointerState,
  isExtensionNavPointerActive,
  queueExtensionNavPointer,
  resetExtensionNavPointerQueueForTests,
  syncExtensionNavigationAfterInstall,
} from './extension-nav-pointer.svelte';

function createMockStore<T>(initial: T): {
  subscribe: (run: (value: T) => void) => () => void;
  set: (value: T) => void;
} {
  let value = initial;
  const subscribers = new Set<(next: T) => void>();

  return {
    subscribe(run: (next: T) => void): () => void {
      run(value);
      subscribers.add(run);
      return (): void => {
        subscribers.delete(run);
      };
    },
    set(next: T): void {
      value = next;
      subscribers.forEach(run => run(value));
    },
  };
}

const { webviewsStore, fetchWebviewsMock } = vi.hoisted(() => ({
  webviewsStore: createMockStore<WebviewInfo[]>([]),
  fetchWebviewsMock: vi.fn(async () => undefined),
}));

vi.mock(import('/@/stores/webviews'), () => ({
  webviews: webviewsStore,
  fetchWebviews: fetchWebviewsMock,
}));

vi.mock(import('/@/stores/contribs'), () => ({
  contributions: createMockStore([]),
}));

vi.mock(import('/@/stores/navigation/navigation-registry-extension.svelte'), () => ({
  refreshExtensionNavigationItems: vi.fn(),
}));

Object.defineProperty(window, 'events', {
  value: {
    receive: vi.fn(),
  },
  configurable: true,
});

describe('extension-nav-pointer', () => {
  beforeEach(() => {
    resetExtensionNavPointerQueueForTests();
    webviewsStore.set([]);
    vi.clearAllMocks();
  });

  test('resolves pointer to Kubernetes for Kind when no webview exists', () => {
    queueExtensionNavPointer('podman-desktop.kind');

    expect(extensionNavPointerState.value).toEqual({
      extensionId: 'podman-desktop.kind',
      link: '/kubernetes',
      label: 'Kubernetes',
      tooltip: 'Open Kubernetes from the sidebar to create a Kind cluster.',
    });
    expect(isExtensionNavPointerActive('/kubernetes')).toBe(true);
  });

  test('prefers webview target over known page location', () => {
    webviewsStore.set([
      {
        id: 'webview-kind',
        uuid: 'uuid-kind',
        viewType: 'kind-panel',
        sourcePath: '/path',
        icon: undefined,
        name: 'Kind',
        html: '',
        extensionId: 'podman-desktop.kind',
        state: undefined,
      },
    ]);

    queueExtensionNavPointer('podman-desktop.kind');

    expect(extensionNavPointerState.value?.link).toBe('/webviews/webview-kind');
  });

  test('syncExtensionNavigationAfterInstall returns true for known page locations', async () => {
    await expect(syncExtensionNavigationAfterInstall('podman-desktop.minikube')).resolves.toBe(true);
  });

  test('resolves pointer from webview extensionId', () => {
    const webview: WebviewInfo = {
      id: 'webview-1',
      uuid: 'uuid-1',
      viewType: 'studio',
      sourcePath: '/path',
      icon: undefined,
      name: 'AI Lab',
      html: '',
      extensionId: 'redhat.ai-lab',
      state: undefined,
    };

    webviewsStore.set([webview]);
    queueExtensionNavPointer('redhat.ai-lab');

    expect(extensionNavPointerState.value).toEqual({
      extensionId: 'redhat.ai-lab',
      link: '/webviews/webview-1',
      label: 'AI Lab',
      tooltip: 'Open AI Lab from the sidebar to get started.',
    });
    expect(isExtensionNavPointerActive('/webviews/webview-1')).toBe(true);
  });

  test('syncExtensionNavigationAfterInstall returns true when webview is available', async () => {
    webviewsStore.set([
      {
        id: 'webview-1',
        uuid: 'uuid-1',
        viewType: 'studio',
        sourcePath: '/path',
        icon: undefined,
        name: 'AI Lab',
        html: '',
        extensionId: 'redhat.ai-lab',
        state: undefined,
      },
    ]);

    await expect(syncExtensionNavigationAfterInstall('redhat.ai-lab')).resolves.toBe(true);
    expect(fetchWebviewsMock).toHaveBeenCalled();
  });

  test('dismiss clears active pointer and shows the next queued extension', () => {
    webviewsStore.set([
      {
        id: 'webview-1',
        uuid: 'uuid-1',
        viewType: 'studio',
        sourcePath: '/path',
        icon: undefined,
        name: 'AI Lab',
        html: '',
        extensionId: 'redhat.ai-lab',
        state: undefined,
      },
      {
        id: 'webview-2',
        uuid: 'uuid-2',
        viewType: 'bootable-containers',
        sourcePath: '/path2',
        icon: undefined,
        name: 'Bootable Containers',
        html: '',
        extensionId: 'redhat.bootable-containers',
        state: undefined,
      },
    ]);

    queueExtensionNavPointer('redhat.ai-lab');
    queueExtensionNavPointer('redhat.bootable-containers');

    expect(extensionNavPointerState.value?.extensionId).toBe('redhat.ai-lab');

    dismissExtensionNavPointer();

    expect(extensionNavPointerState.value).toEqual({
      extensionId: 'redhat.bootable-containers',
      link: '/webviews/webview-2',
      label: 'Bootable Containers',
      tooltip: 'Open Bootable Containers from the sidebar to get started.',
    });
  });

  test('dismiss clears active pointer when only one is queued', () => {
    extensionNavPointerState.value = {
      extensionId: 'redhat.ai-lab',
      link: '/webviews/webview-1',
      label: 'AI Lab',
      tooltip: 'Open AI Lab from the sidebar to get started.',
    };

    dismissExtensionNavPointer();

    expect(extensionNavPointerState.value).toBeNull();
    expect(isExtensionNavPointerActive('/webviews/webview-1')).toBe(false);
  });
});
