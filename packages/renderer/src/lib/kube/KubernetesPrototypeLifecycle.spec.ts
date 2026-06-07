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

import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { activePrototype, currentScreen } from '/@/stores/prototype';

import KubernetesPrototypeLifecycle from './KubernetesPrototypeLifecycle.svelte';

const { registerDeveloperSandboxPromptPrototype, routerSubscribe } = vi.hoisted(() => ({
  registerDeveloperSandboxPromptPrototype: vi.fn(),
  routerSubscribe: vi.fn(),
}));

vi.mock(import('/@/lib/kube/developer-sandbox-prompt-prototype'), () => ({
  developerSandboxPromptPrototypeName: 'Developer Sandbox prompt',
  registerDeveloperSandboxPromptPrototype,
}));

vi.mock(import('tinro'), () => ({
  router: {
    subscribe: routerSubscribe,
  },
}));

beforeEach(() => {
  registerDeveloperSandboxPromptPrototype.mockReset();
  routerSubscribe.mockReset();
  activePrototype.set(undefined);
  currentScreen.set('');
  registerDeveloperSandboxPromptPrototype.mockImplementation((initialScreen?: string) => {
    activePrototype.set({ name: 'Developer Sandbox prompt', screens: [] });
    if (initialScreen) {
      currentScreen.set(initialScreen);
    }
  });
});

test('expect prototype to register when navigating to a Kubernetes route', () => {
  routerSubscribe.mockImplementation(callback => {
    callback({ url: '/kubernetes/dashboard' });
    return (): void => {};
  });

  render(KubernetesPrototypeLifecycle);

  expect(registerDeveloperSandboxPromptPrototype).toHaveBeenCalledOnce();
});

test('expect prototype to stay registered when navigating to Resources for Developer Sandbox connect', () => {
  routerSubscribe.mockImplementation(callback => {
    callback({ url: '/kubernetes/dashboard' });
    callback({ url: '/preferences/resources?focus=redhat.sandbox' });
    return (): void => {};
  });

  render(KubernetesPrototypeLifecycle);

  expect(get(activePrototype)?.name).toBe('Developer Sandbox prompt');
  expect(registerDeveloperSandboxPromptPrototype).toHaveBeenCalledOnce();
});

test('expect prototype to unregister when leaving Kubernetes routes', () => {
  activePrototype.set({ name: 'Developer Sandbox prompt', screens: [] });
  currentScreen.set('no-cluster-extension-installed');

  routerSubscribe.mockImplementation(callback => {
    callback({ url: '/kubernetes/dashboard' });
    callback({ url: '/containers' });
    return (): void => {};
  });

  render(KubernetesPrototypeLifecycle);

  expect(get(activePrototype)).toBeUndefined();
});

test('expect selected prototype screen to be restored when returning to Kubernetes', () => {
  routerSubscribe.mockImplementation(callback => {
    callback({ url: '/kubernetes/dashboard' });
    currentScreen.set('no-cluster-extension-installed');
    callback({ url: '/containers' });
    callback({ url: '/kubernetes/pods' });
    return (): void => {};
  });

  render(KubernetesPrototypeLifecycle);

  expect(registerDeveloperSandboxPromptPrototype).toHaveBeenLastCalledWith('no-cluster-extension-installed');
});

test('expect prototype to unregister on destroy when still active', () => {
  activePrototype.set({ name: 'Developer Sandbox prompt', screens: [] });

  routerSubscribe.mockImplementation(callback => {
    callback({ url: '/kubernetes/dashboard' });
    return (): void => {};
  });

  const { unmount } = render(KubernetesPrototypeLifecycle);
  unmount();

  expect(get(activePrototype)).toBeUndefined();
});
