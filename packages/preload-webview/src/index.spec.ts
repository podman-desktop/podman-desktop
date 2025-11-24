/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { beforeEach, expect, test, vi } from 'vitest';

import { init } from '.';
import * as webviewPreload from './webview-preload';
import { WebviewPreload } from './webview-preload';

vi.mock(import('./webview-preload'));

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(WebviewPreload.prototype.init).mockResolvedValue(undefined);
});

test('check call constructor with correct web id by parsing window.location.search', () => {
  Object.defineProperty(window, 'location', {
    value: {
      search: '?webviewId=123',
    },
  });

  init();

  // expect constructor has been called with the correct webviewID
  expect(webviewPreload.WebviewPreload).toHaveBeenCalledWith('123');
});

test('check error if invalid window.location.search', () => {
  Object.defineProperty(window, 'location', {
    value: {
      search: '',
    },
  });

  // expect failure as webviewId is not defined
  expect(() => init()).toThrow('The webviewId is not defined');
});
