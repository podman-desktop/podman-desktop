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
  getPrototypeOnboardingRouteExtensionId,
  PROTOTYPE_ONBOARDING_ROUTE_EXTENSION_ID,
  showPostInstallTooltipDemo,
} from './extension-prototype-post-install-tooltip-demo';
import { setPrototypeUseCasesEnabled } from './extension-prototype-use-cases';

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

const { webviewsStore, fetchWebviewsMock, markNewlyInstalledMock, queueExtensionNavPointerMock } = vi.hoisted(() => ({
  webviewsStore: createMockStore<WebviewInfo[]>([]),
  fetchWebviewsMock: vi.fn(async () => undefined),
  markNewlyInstalledMock: vi.fn(),
  queueExtensionNavPointerMock: vi.fn(),
}));

vi.mock(import('/@/stores/webviews'), () => ({
  webviews: webviewsStore,
  fetchWebviews: fetchWebviewsMock,
}));

vi.mock(import('/@/lib/extensions/extension-catalog-settings.svelte'), () => ({
  markNewlyInstalled: markNewlyInstalledMock,
}));

vi.mock(import('/@/lib/extensions/extension-nav-pointer.svelte'), () => ({
  findWebviewForExtension: (extensionId: string, allWebviews: WebviewInfo[]): WebviewInfo | undefined =>
    allWebviews.find(item => item.extensionId === extensionId),
  queueExtensionNavPointer: queueExtensionNavPointerMock,
}));

describe('extension-prototype-post-install-tooltip-demo', () => {
  beforeEach(() => {
    setPrototypeUseCasesEnabled(true);
    webviewsStore.set([]);
    vi.clearAllMocks();
  });

  test('routes prototype tooltip Learn to Podman onboarding', () => {
    expect(getPrototypeOnboardingRouteExtensionId('redhat.ai-lab')).toBe(PROTOTYPE_ONBOARDING_ROUTE_EXTENSION_ID);
    expect(getPrototypeOnboardingRouteExtensionId('other.extension')).toBe('other.extension');
  });

  test('shows tooltip demo when AI Lab webview is available', async () => {
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

    const result = await showPostInstallTooltipDemo();

    expect(result).toEqual({ shown: true });
    expect(markNewlyInstalledMock).toHaveBeenCalledWith('redhat.ai-lab');
    expect(queueExtensionNavPointerMock).toHaveBeenCalledWith('redhat.ai-lab');
  });

  test('returns guidance when no catalog webview is installed', async () => {
    const result = await showPostInstallTooltipDemo();

    expect(result.shown).toBe(false);
    expect(result.message).toContain('Podman AI Lab');
    expect(markNewlyInstalledMock).not.toHaveBeenCalled();
  });
});
