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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import ProviderTooltipStatusStyle from './ProviderTooltipStatusStyle.svelte';

test('Expect to have different status icon based on provider status', async () => {
  const renderObject = render(ProviderTooltipStatusStyle, { status: 'ready' });

  const statusIcon = screen.getByLabelText('Connection Status Name');
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-running)]');

  await renderObject.rerender({ status: 'error' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-terminated)]');

  await renderObject.rerender({ status: 'unknown' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-unknown)]');

  await renderObject.rerender({ status: 'started' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-running)]');

  await renderObject.rerender({ status: 'stopped' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-stopped)]');

  await renderObject.rerender({ status: 'not-installed' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-not-running)]');

  await renderObject.rerender({ status: 'installed' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-not-running)]');

  await renderObject.rerender({ status: 'starting' });
  expect(statusIcon).toBeInTheDocument();
  expect(statusIcon).toHaveClass('text-[var(--pd-status-starting)]');
});
