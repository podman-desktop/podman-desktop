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

import type { ImageInspectInfo } from '@desktop-framework/api';
import { render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';

import ImageDetailsInspect from './ImageDetailsInspect.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

vi.mock(import('/@/lib/editor/MonacoEditor.svelte'));

const imageInfoUI = {
  id: 'sha256:1234',
  engineId: 'podman1',
} as unknown as ImageInfoUI;

test('Expect monaco editor to be called with the detailed inspect info, without engine properties', async () => {
  vi.mocked(window.getImageInspectDetails).mockResolvedValue({
    engineId: 'podman1',
    engineName: 'Podman',
    engineType: 'podman',
    Id: 'sha256:1234',
    Digest: 'sha256:5678',
    NamesHistory: ['localhost/foo:old'],
  } as unknown as ImageInspectInfo);

  render(ImageDetailsInspect, { image: imageInfoUI });

  expect(window.getImageInspectDetails).toHaveBeenCalledWith('podman1', 'sha256:1234');
  expect(window.getImageInspect).not.toHaveBeenCalled();

  await vi.waitFor(() => {
    expect(MonacoEditor).toHaveBeenCalledWith(expect.anything(), {
      content: JSON.stringify(
        { engineType: 'podman', Id: 'sha256:1234', Digest: 'sha256:5678', NamesHistory: ['localhost/foo:old'] },
        undefined,
        2,
      ),
      language: 'json',
    });
  });
});
