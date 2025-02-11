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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import KubernetesColumnName from './KubernetesColumnName.svelte';

test('Expect simple column styling', async () => {
  render(KubernetesColumnName, { object: { name: 'my-pod', status: '' } });

  const text = screen.getByText('my-pod');
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text-highlight)]');
});

test('Expect clicking works', async () => {
  render(KubernetesColumnName, {
    object: { name: 'my-deployment', namespace: 'default', kind: 'Deployment', status: '' },
  });

  const text = screen.getByText('my-deployment');
  expect(text).toBeInTheDocument();

  // test click
  const routerGotoSpy = vi.spyOn(router, 'goto');

  await fireEvent.click(text);

  expect(routerGotoSpy).toBeCalledWith('/kubernetes/deployments/my-deployment/default/summary');
});

test('Expect to show namespace in column', async () => {
  const namespace = 'default';

  render(KubernetesColumnName, {
    object: {
      name: 'my-pod',
      namespace: namespace,
      status: '',
    },
  });

  const text = screen.getByText(namespace);
  expect(text).toBeInTheDocument();
});
