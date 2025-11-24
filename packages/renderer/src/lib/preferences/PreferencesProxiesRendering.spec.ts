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

import { Dropdown } from '@podman-desktop/ui-svelte';
import { fireEvent, render } from '@testing-library/svelte';
import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import PreferencesProxiesRendering from '/@/lib/preferences/PreferencesProxiesRendering.svelte';
import { PROXY_LABELS } from '/@/lib/preferences/proxy-state-labels';
import { ProxyState } from '/@api/proxy';

// mock the ui library
vi.mock(import('@podman-desktop/ui-svelte'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    Dropdown: vi.fn() as unknown as typeof Dropdown,
  };
});

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.getProviderInfos).mockResolvedValue([]);
});

describe('dropdown', () => {
  test('dropdown should receive proper options', () => {
    render(PreferencesProxiesRendering);

    expect(Dropdown).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        options: Array.from(PROXY_LABELS.values()).map(label => ({
          value: label,
          label: label,
        })),
      }),
    );
  });

  test('dropdown value should match window#getProxyState', async () => {
    // mock disabled state
    vi.mocked(window.getProxyState).mockResolvedValue(ProxyState.PROXY_DISABLED);

    render(PreferencesProxiesRendering);

    await vi.waitFor(() => {
      expect(Dropdown).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          value: PROXY_LABELS.get(ProxyState.PROXY_DISABLED),
        }),
      );
    });
  });

  test('dropdown#onChange should update value', async () => {
    // mock disabled state
    vi.mocked(window.getProxyState).mockResolvedValue(ProxyState.PROXY_DISABLED);

    render(PreferencesProxiesRendering);

    expect(Dropdown).toHaveBeenCalled();
    const [, { onChange }] = vi.mocked(Dropdown).mock.calls[0];

    const label = PROXY_LABELS.get(ProxyState.PROXY_MANUAL);
    assert(label, 'proxy state label for manual should be defined');

    expect(onChange).toBeDefined();
    onChange?.(label);

    // dropdown component should have been updated with proxy manual value
    await vi.waitFor(() => {
      expect(Dropdown).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          value: label,
        }),
      );
    });
  });

  test('update button should reflect change', async () => {
    // mock disabled state
    vi.mocked(window.getProxyState).mockResolvedValue(ProxyState.PROXY_DISABLED);

    const { getByRole } = render(PreferencesProxiesRendering);

    expect(Dropdown).toHaveBeenCalled();
    const [, { onChange }] = vi.mocked(Dropdown).mock.calls[0];

    const label = PROXY_LABELS.get(ProxyState.PROXY_MANUAL);
    assert(label, 'proxy state label for manual should be defined');

    expect(onChange).toBeDefined();
    onChange?.(label);

    // dropdown component should have been updated with proxy manual value
    await vi.waitFor(() => {
      expect(Dropdown).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          value: label,
        }),
      );
    });

    const updateBtn = getByRole('button', { name: 'Update' });
    await fireEvent.click(updateBtn);

    await vi.waitFor(() => {
      expect(window.setProxyState).toHaveBeenCalledWith(ProxyState.PROXY_MANUAL);
    });
  });
});
