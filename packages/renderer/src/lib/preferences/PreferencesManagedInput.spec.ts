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

import { render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import PreferencesManagedInput from '/@/lib/preferences/PreferencesManagedInput.svelte';

test('should display the managed by organization text after rendering', async () => {
  const { getByText } = render(PreferencesManagedInput);

  await vi.waitFor(() => {
    const element = getByText('Managed by your organization');
    expect(element).toBeInTheDocument();
  });
});

test('should render the lock icon', async () => {
  const { container } = render(PreferencesManagedInput);

  await vi.waitFor(() => {
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});
