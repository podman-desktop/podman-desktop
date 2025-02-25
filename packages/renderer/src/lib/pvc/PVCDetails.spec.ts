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

import type { KubernetesObject, V1PersistentVolumeClaim } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { isKubernetesExperimentalMode } from '/@/lib/kube/resources-listen';
import {
  initListExperimental,
  initListsNonExperimental,
  type initListsReturnType,
} from '/@/lib/kube/tests-helpers/init-lists';
import * as states from '/@/stores/kubernetes-contexts-state';

import PVCDetails from './PVCDetails.svelte';

const pvc: V1PersistentVolumeClaim = {
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    name: 'my-pvc',
    namespace: 'default',
  },
} as V1PersistentVolumeClaim;

vi.mock(import('/@/lib/kube/resources-listen'), async importOriginal => {
  // we want to keep the original nonVerbose
  const original = await importOriginal();
  return {
    ...original,
    listenResources: vi.fn(),
    isKubernetesExperimentalMode: vi.fn(),
  };
});

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  router.goto('http://localhost:3000');
});

describe.each<{
  experimental: boolean;
  initLists: (configmaps: KubernetesObject[]) => initListsReturnType;
}>([
  {
    experimental: false,
    initLists: initListsNonExperimental({
      onResourcesStore: store => (vi.mocked(states).kubernetesCurrentContextPersistentVolumeClaims = store),
    }),
  },
  {
    experimental: true,
    initLists: initListExperimental({ resourceName: 'persistentvolumeclaims' }),
  },
])('is experimental: $experimental', ({ experimental, initLists }) => {
  beforeEach(() => {
    vi.mocked(isKubernetesExperimentalMode).mockResolvedValue(experimental);
  });

  test('Expect renders PVC details', async () => {
    // mock object store
    initLists([pvc]);

    render(PVCDetails, { name: 'my-pvc', namespace: 'default' });

    await vi.waitFor(() => {
      expect(screen.getByText('my-pvc')).toBeInTheDocument();
    });
  });
});
