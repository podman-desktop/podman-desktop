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

import { beforeEach, describe, expect, test } from 'vitest';

import { manualProxySettings } from './manual-proxy-settings.svelte';

describe('manualProxySettings', () => {
  beforeEach(() => {
    manualProxySettings.clear();
  });

  test('should be undefined initially', () => {
    expect(manualProxySettings.current).toBeUndefined();
  });

  test('should save manual proxy settings', () => {
    const settings = {
      httpProxy: 'http://proxy:8080',
      httpsProxy: 'https://proxy:8443',
      noProxy: 'localhost',
    };

    manualProxySettings.save(settings);

    expect(manualProxySettings.current).toEqual(settings);
  });

  test('should clear settings', () => {
    manualProxySettings.save({ httpProxy: 'test', httpsProxy: '', noProxy: '' });
    manualProxySettings.clear();

    expect(manualProxySettings.current).toBeUndefined();
  });
});
