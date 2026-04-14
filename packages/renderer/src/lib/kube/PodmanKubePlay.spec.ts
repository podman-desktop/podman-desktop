/*********************************************************************
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
 ********************************************************************/

import '@testing-library/jest-dom/vitest';

import { fireEvent, render } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import PodmanKubePlay from './PodmanKubePlay.svelte';

// Mock the router
vi.mock('tinro', () => ({
  router: {
    goto: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('Expect button to be visible with correct text and title', () => {
  const { getByRole } = render(PodmanKubePlay);

  const button = getByRole('button', { name: 'Podman Kube Play' });
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('Podman Kube Play');
  expect(button).toHaveAttribute('title', 'Create containers, pods and volumes based on Kubernetes YAML');
});

test('Expect click on button to navigate to kube play page', async () => {
  const { getByRole } = render(PodmanKubePlay);

  const button = getByRole('button', { name: 'Podman Kube Play' });
  expect(button).toBeInTheDocument();

  // Verify router.goto hasn't been called yet
  expect(router.goto).not.toHaveBeenCalled();

  // Click the button
  await fireEvent.click(button);

  // Verify navigation was triggered
  expect(router.goto).toHaveBeenCalledWith('/kube/play');
  expect(router.goto).toHaveBeenCalledTimes(1);
});
