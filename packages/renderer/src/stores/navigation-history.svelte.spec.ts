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

import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { goBack, goForward, navigationHistory } from './navigation-history.svelte';

vi.mock(import('tinro'));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);
  // Reset navigation history state
  navigationHistory.stack = [];
  navigationHistory.index = -1;
});

describe('goBack', () => {
  test('should not navigate when history is empty', () => {
    goBack();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should not navigate when at first entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goBack();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should navigate to previous entry', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    goBack();

    expect(navigationHistory.index).toBe(0);
    expect(router.goto).toHaveBeenCalledWith('/containers');
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.back');
  });
});

describe('goForward', () => {
  test('should not navigate when history is empty', () => {
    goForward();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should not navigate when at last entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goForward();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should navigate to next entry', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    goForward();

    expect(navigationHistory.index).toBe(1);
    expect(router.goto).toHaveBeenCalledWith('/images');
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.forward');
  });
});
