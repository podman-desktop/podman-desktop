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

import { fireEvent, render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import PreferencesManagedLabel from '/@/lib/preferences/PreferencesManagedLabel.svelte';

test('should display the managed label text after rendering', async () => {
  const { getByText } = render(PreferencesManagedLabel);

  await vi.waitFor(() => {
    const element = getByText('Managed');
    expect(element).toBeInTheDocument();
  });
});

test('simple test to see if the svg (icon) renders', async () => {
  const { container } = render(PreferencesManagedLabel);

  await vi.waitFor(() => {
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});

test('should have This setting is managed by your organization tooltip', async () => {
  const { getByText, getByTestId } = render(PreferencesManagedLabel);

  await vi.waitFor(async () => {
    const tooltipTrigger = getByTestId('tooltip-trigger');
    await fireEvent.mouseEnter(tooltipTrigger);

    const element = getByText('This setting is managed by your organization.');
    expect(element).toBeInTheDocument();
  });
});
