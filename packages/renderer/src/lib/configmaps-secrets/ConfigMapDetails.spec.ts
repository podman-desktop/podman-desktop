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

import type { KubernetesObject, V1ConfigMap } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import { isKubernetesExperimentalMode } from '../kube/resources-listen';
import {
  initListExperimental,
  initListsNonExperimental,
  type initListsReturnType,
} from '../kube/tests-helpers/init-lists';
import ConfigMapDetails from './ConfigMapDetails.svelte';

const configMap: V1ConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: 'my-configmap',
    namespace: 'default',
  },
  data: {},
};

vi.mock(import('../kube/resources-listen'), async importOriginal => {
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
      onResourcesStore: store => (vi.mocked(states).kubernetesCurrentContextConfigMaps = store),
    }),
  },
  {
    experimental: true,
    initLists: initListExperimental({ resourceName: 'configmaps' }),
  },
])('is experimental: $experimental', ({ experimental, initLists }) => {
  beforeEach(() => {
    vi.mocked(isKubernetesExperimentalMode).mockResolvedValue(experimental);
  });

  test('Confirm renders configmap details', async () => {
    initLists([configMap]);

    render(ConfigMapDetails, { name: 'my-configmap', namespace: 'default' });

    await vi.waitFor(() => {
      expect(screen.getByText('my-configmap')).toBeInTheDocument();
      expect(screen.getByText('default')).toBeInTheDocument();
    });
  });
});
