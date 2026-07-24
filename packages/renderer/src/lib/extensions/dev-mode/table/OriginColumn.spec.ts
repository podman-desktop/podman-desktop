/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import OriginColumn from './OriginColumn.svelte';

test('shows Local outlined label with sky color', () => {
  render(OriginColumn, {
    object: {
      path: '/tmp/local',
      name: '/tmp/local',
      selected: false,
      source: 'folder',
    } as SelectableExtensionDevelopmentFolderInfoUI,
  });
  const label = screen.getByLabelText('Local');
  expect(label).toBeInTheDocument();
  expect(label).toHaveClass('cursor-default');
  expect(label.className).toContain('border-[var(--pd-badge-sky)]');
  expect(label.className).toContain('text-[var(--pd-badge-sky)]');
});

test('shows Custom outlined label with primary color', () => {
  render(OriginColumn, {
    object: {
      path: '/tmp/custom',
      name: 'Custom Ext',
      selected: false,
      source: 'custom',
    } as SelectableExtensionDevelopmentFolderInfoUI,
  });
  const label = screen.getByLabelText('Custom');
  expect(label).toBeInTheDocument();
  expect(label.className).toContain('border-[var(--pd-button-primary-bg)]');
  expect(label.className).toContain('text-[var(--pd-button-primary-bg)]');
});
