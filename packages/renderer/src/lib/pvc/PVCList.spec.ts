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
import { fireEvent, render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import PVCList from './PVCList.svelte';

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(states).persistentVolumeClaimSearchPattern = writable<string>('');
  vi.mocked(states).kubernetesContextsCheckingStateDelayed = writable();
  vi.mocked(states).kubernetesCurrentContextState = writable();
});

test('Expect PVC empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextPersistentVolumeClaimsFiltered = writable<KubernetesObject[]>([]);
  render(PVCList);
  const noPVCS = screen.getByRole('heading', { name: 'No PVCs' });
  expect(noPVCS).toBeInTheDocument();
});

test('Expect PVC list', async () => {
  const pvc: V1PersistentVolumeClaim = {
    metadata: {
      name: 'pvc1',
      namespace: 'default',
    },
  } as V1PersistentVolumeClaim;

  vi.mocked(states).kubernetesCurrentContextPersistentVolumeClaimsFiltered = writable<KubernetesObject[]>([pvc]);

  render(PVCList);

  await vi.waitFor(() => {
    const pvcName = screen.getByRole('cell', { name: 'pvc1 default' });
    expect(pvcName).toBeInTheDocument();
  });
});

test('Expect user confirmation to pop up when preferences require', async () => {
  const pvc: V1PersistentVolumeClaim = {
    metadata: {
      name: 'pvc12',
      namespace: 'default',
    },
  } as V1PersistentVolumeClaim;

  vi.mocked(states).kubernetesCurrentContextPersistentVolumeClaimsFiltered = writable<KubernetesObject[]>([pvc]);

  render(PVCList);

  await vi.waitFor(() => {
    const pvcName1 = screen.getByRole('cell', { name: 'pvc12 default' });
    expect(pvcName1).toBeInTheDocument();
  });

  const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle PVC' });
  await fireEvent.click(checkboxes[0]);
  expect(checkboxes[0]).toBeChecked();

  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });

  const deleteButton = screen.getByRole('button', { name: 'Delete 1 selected items' });
  await fireEvent.click(deleteButton);
  expect(window.showMessageBox).toHaveBeenCalledOnce();

  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  await fireEvent.click(deleteButton);
  expect(window.showMessageBox).toHaveBeenCalledTimes(2);
  await vi.waitFor(() => expect(window.kubernetesDeletePersistentVolumeClaim).toHaveBeenCalled());
});

test('PVCs list is updated when kubernetesCurrentContextPersistentVolumeClaimsFiltered changes', async () => {
  const pvc1: V1PersistentVolumeClaim = {
    metadata: {
      name: 'my-pvc-1',
      namespace: 'test-namespace',
    },
  } as V1PersistentVolumeClaim;
  const pvc2: V1PersistentVolumeClaim = {
    metadata: {
      name: 'my-pvc-2',
      namespace: 'test-namespace',
    },
  } as V1PersistentVolumeClaim;
  const filtered = writable<KubernetesObject[]>([pvc1, pvc2]);
  vi.mocked(states).kubernetesCurrentContextPersistentVolumeClaimsFiltered = filtered;

  const component = render(PVCList);

  await vi.waitFor(() => {
    const pvcName1 = screen.getByRole('cell', { name: 'my-pvc-1 test-namespace' });
    expect(pvcName1).toBeInTheDocument();
    const pvcName2 = screen.getByRole('cell', { name: 'my-pvc-2 test-namespace' });
    expect(pvcName2).toBeInTheDocument();
  });

  filtered.set([pvc2]);
  await component.rerender({});

  const pvcName1after = screen.queryByRole('cell', { name: 'my-pvc-1 test-namespace' });
  expect(pvcName1after).not.toBeInTheDocument();
  const pvcName2after = screen.getByRole('cell', { name: 'my-pvc-2 test-namespace' });
  expect(pvcName2after).toBeInTheDocument();
});
