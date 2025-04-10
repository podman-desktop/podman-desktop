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
import { expect, test } from 'vitest';

import ProviderWidgetStatus from './ProviderWidgetStatus.svelte';

test('Expect to have different status icon based on provider status', async () => {
  const renderObject = render(ProviderWidgetStatus, { status: 'ready' });

  let statusIcon = screen.getByLabelText('Connection Status Icon');
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('fa-regular fa-circle-check');

  await renderObject.rerender({ status: 'error' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('fa-regular fa-circle-xmark');

  await renderObject.rerender({ status: 'unknown' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('fa-regular fa-circle-question');

  await renderObject.rerender({ status: 'stopping' });
  statusIcon = screen.getByLabelText('Connection Status Icon');
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass(
    'animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent',
  );
});

test('Expect to have Update available icon status when an Update available status is passed', () => {
  render(ProviderWidgetStatus, { status: 'Update available' });
  const statusIcon = screen.getByLabelText('Connection Status Icon');
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('fa-regular fa-circle-up');
});
