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

import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { AppearanceUtil } from '/@/lib/appearance/appearance-util';

import { colorsEventStore, colorsInfos, darkContextColorsInfos, hcDarkContextColorsInfos } from './colors';

vi.mock(import('/@/lib/appearance/appearance-util'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(AppearanceUtil.prototype.getTheme).mockResolvedValue('light');
});

test('grab colors', async () => {
  vi.mocked(window.listColors).mockImplementation((theme: string) => {
    if (theme === 'dark') {
      return Promise.resolve([{ id: 'color-dark', value: '#dark01', cssVar: '--pd-color-dark' }]);
    }
    if (theme === 'hc-dark') {
      return Promise.resolve([{ id: 'color-hcdark', value: '#hcd01', cssVar: '--pd-color-hcdark' }]);
    }
    return Promise.resolve([
      { id: 'color1', value: '#123', cssVar: '--pd-color1' },
      { id: 'color2', value: '#456', cssVar: '--pd-color2' },
    ]);
  });
  colorsEventStore.setup();

  // send 'extensions-already-started' event
  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  // wait listColors is called
  await vi.waitFor(() => expect(window.listColors).toHaveBeenCalled());

  // now get the current-theme list
  const colors = get(colorsInfos);
  expect(colors.length).toBe(2);
  expect(colors[0].id).toBe('color1');
  expect(colors[0].value).toBe('#123');
  expect(colors[0].cssVar).toBe('--pd-color1');
  expect(colors[1].id).toBe('color2');
  expect(colors[1].value).toBe('#456');
  expect(colors[1].cssVar).toBe('--pd-color2');

  // dark context store should be populated with dark-theme values
  const darkColors = get(darkContextColorsInfos);
  expect(darkColors.length).toBe(1);
  expect(darkColors[0].id).toBe('color-dark');
  expect(darkColors[0].value).toBe('#dark01');
  expect(darkColors[0].cssVar).toBe('--pd-color-dark');

  // hc-dark context store should be populated with hc-dark-theme values
  const hcDarkColors = get(hcDarkContextColorsInfos);
  expect(hcDarkColors.length).toBe(1);
  expect(hcDarkColors[0].id).toBe('color-hcdark');
  expect(hcDarkColors[0].value).toBe('#hcd01');
  expect(hcDarkColors[0].cssVar).toBe('--pd-color-hcdark');
});
