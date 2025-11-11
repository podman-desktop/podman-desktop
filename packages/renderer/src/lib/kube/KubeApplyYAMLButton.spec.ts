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

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import KubeApplyYamlButton from './KubeApplyYAMLButton.svelte';

vi.mock('tinro', () => ({
  router: {
    goto: vi.fn().mockReturnValue(undefined),
  },
}));

test(`Verify clicking button will open 'Apply Kubernetes YAML' form`, async () => {
  render(KubeApplyYamlButton);

  const button = screen.getByRole('button', { name: 'Apply YAML' });
  expect(button).toBeInTheDocument();
  await userEvent.click(button);

  expect(router.goto).toHaveBeenCalledWith('/kubernetes/apply');
});
