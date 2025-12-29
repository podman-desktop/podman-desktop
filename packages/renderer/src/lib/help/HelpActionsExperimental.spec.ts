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
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import HelpActionsExperimental from './HelpActionsExperimental.svelte';

let toggleMenuCallback: () => void;

describe('HelpActionsExperimental component', () => {
  beforeAll(() => {
    (window.events as unknown) = {
      receive: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(window.events.receive).mockImplementation((channel: string, callback: () => void) => {
      toggleMenuCallback = callback;
      return {
        dispose: (): void => {},
      };
    });
  });

  test('contains item with $title', async () => {
    vi.mocked(window.events.receive).mockImplementation((channel: string, callback: () => void) => {
      toggleMenuCallback = callback;
      return {
        dispose: (): void => {},
      };
    });
    const { findByTitle } = render(HelpActionsExperimental);
    toggleMenuCallback();
    await vi.waitFor(async () => {
      const items = await findByTitle('Help Menu Items');
      expect(items).toBeVisible();
    });
  });
});
