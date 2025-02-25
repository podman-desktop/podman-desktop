/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { navigateTo } from './kubernetesNavigation';

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.resetAllMocks();
});

test(`Test navigation to Nodes`, () => {
  navigateTo({ kind: 'Node' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/nodes');
});

test(`Test navigation to a Node`, () => {
  navigateTo({ kind: 'Node', name: 'dummy-name' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/nodes/dummy-name/summary');
});

test(`Test navigation to Services`, () => {
  navigateTo({ kind: 'Service' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/services');
});

test(`Test navigation to a Service`, () => {
  navigateTo({ kind: 'Service', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/services/dummy-name/dummy-ns/summary');
});

test(`Test navigation to Deployments`, () => {
  navigateTo({ kind: 'Deployment' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/deployments');
});

test(`Test navigation to a Deployment`, () => {
  navigateTo({ kind: 'Deployment', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/deployments/dummy-name/dummy-ns/summary');
});

test(`Test navigation to Pods`, () => {
  navigateTo({ kind: 'Pod' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/pods');
});

test(`Test navigation to a Pod`, () => {
  navigateTo({ kind: 'Pod', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/pods/dummy-name/dummy-ns/summary');
});

test(`Test navigation to PersistentVolumeClaims`, () => {
  navigateTo({ kind: 'PersistentVolumeClaim' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/persistentvolumeclaims');
});

test(`Test navigation to a PersistentVolumeClaim`, () => {
  navigateTo({ kind: 'PersistentVolumeClaim', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/persistentvolumeclaims/dummy-name/dummy-ns/summary');
});

test(`Test navigation to Ingresses`, () => {
  navigateTo({ kind: 'Ingress' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/ingressesRoutes');
});

test(`Test navigation to a Ingress`, () => {
  navigateTo({ kind: 'Ingress', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith(
    '/kubernetes/ingressesRoutes/ingress/dummy-name/dummy-ns/summary',
  );
});

test(`Test navigation to Routes`, () => {
  navigateTo({ kind: 'Route' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/ingressesRoutes');
});

test(`Test navigation to a Route`, () => {
  navigateTo({ kind: 'Route', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/ingressesRoutes/route/dummy-name/dummy-ns/summary');
});

test(`Test navigation to ConfigMaps`, () => {
  navigateTo({ kind: 'ConfigMap' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/configmapsSecrets');
});

test(`Test navigation to a ConfigMap`, () => {
  navigateTo({ kind: 'ConfigMap', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith(
    '/kubernetes/configmapsSecrets/configmap/dummy-name/dummy-ns/summary',
  );
});

test(`Test navigation to Secrets`, () => {
  navigateTo({ kind: 'Secret' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/kubernetes/configmapsSecrets');
});

test(`Test navigation to a Secret`, () => {
  navigateTo({ kind: 'Secret', name: 'dummy-name', namespace: 'dummy-ns' });

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith(
    '/kubernetes/configmapsSecrets/secret/dummy-name/dummy-ns/summary',
  );
});
