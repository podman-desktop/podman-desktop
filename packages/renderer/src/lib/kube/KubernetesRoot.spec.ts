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

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { lastSubmenuPages } from '/@/stores/breadcrumb';

import KubernetesRoot from './KubernetesRoot.svelte';

vi.mock(import('tinro'));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('KubernetesRoot component', () => {
  test('go to last kubernetes page when available', async () => {
    lastSubmenuPages.set({ Kubernetes: '/kubernetes/deployments' });
    render(KubernetesRoot);

    expect(router.goto).toHaveBeenCalledWith('/kubernetes/deployments');
  });

  test('go to dashboard page when last kubernetes page is /kubernetes', async () => {
    lastSubmenuPages.set({ Kubernetes: '/kubernetes' });
    render(KubernetesRoot);

    expect(router.goto).toHaveBeenCalledWith('/kubernetes/dashboard');
  });

  test('go to dashboard page when last kubernetes page not available', async () => {
    lastSubmenuPages.set({});
    render(KubernetesRoot);
    expect(router.goto).toHaveBeenCalledWith('/kubernetes/dashboard');
  });
});
