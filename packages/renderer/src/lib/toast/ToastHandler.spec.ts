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

import { render } from '@testing-library/svelte';
import { toast } from '@zerodevx/svelte-toast';
import { beforeEach, expect, test, vi } from 'vitest';

import ToastHandler from './ToastHandler.svelte';

vi.mock(import('@zerodevx/svelte-toast'));

const receiveMock = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();

  Object.defineProperty(window, 'events', {
    value: { receive: receiveMock },
    writable: true,
  });
});

function getToastEventCallback(): (object: unknown) => void {
  render(ToastHandler);
  const [[, callback]] = receiveMock.mock.calls;
  return callback as (object: unknown) => void;
}

test('success toast uses --pd-toast-success-* variables', () => {
  const toastPushSpy = vi.spyOn(toast, 'push');
  const callback = getToastEventCallback();

  callback({ type: 'success', message: 'Done' });

  expect(toastPushSpy).toHaveBeenCalledWith('Done', {
    pausable: true,
    theme: {
      '--toastBackground': 'var(--pd-toast-success-bg)',
      '--toastColor': 'var(--pd-toast-success-color)',
      '--toastBarBackground': 'var(--pd-toast-success-bar-bg)',
    },
  });
});

test('error toast uses --pd-toast-error-* variables', () => {
  const toastPushSpy = vi.spyOn(toast, 'push');
  const callback = getToastEventCallback();

  callback({ type: 'error', message: 'Failed' });

  expect(toastPushSpy).toHaveBeenCalledWith('Failed', {
    pausable: true,
    theme: {
      '--toastBackground': 'var(--pd-toast-error-bg)',
      '--toastColor': 'var(--pd-toast-error-color)',
      '--toastBarBackground': 'var(--pd-toast-error-bar-bg)',
    },
  });
});

test('warning toast uses --pd-toast-warning-* variables', () => {
  const toastPushSpy = vi.spyOn(toast, 'push');
  const callback = getToastEventCallback();

  callback({ type: 'warning', message: 'Caution' });

  expect(toastPushSpy).toHaveBeenCalledWith('Caution', {
    pausable: true,
    theme: {
      '--toastBackground': 'var(--pd-toast-warning-bg)',
      '--toastColor': 'var(--pd-toast-warning-color)',
      '--toastBarBackground': 'var(--pd-toast-warning-bar-bg)',
    },
  });
});

test('info toast uses --pd-toast-info-* variables', () => {
  const toastPushSpy = vi.spyOn(toast, 'push');
  const callback = getToastEventCallback();

  callback({ type: 'info', message: 'Note' });

  expect(toastPushSpy).toHaveBeenCalledWith('Note', {
    pausable: true,
    theme: {
      '--toastBackground': 'var(--pd-toast-info-bg)',
      '--toastColor': 'var(--pd-toast-info-color)',
      '--toastBarBackground': 'var(--pd-toast-info-bar-bg)',
    },
  });
});

test('unknown toast type uses empty theme', () => {
  const toastPushSpy = vi.spyOn(toast, 'push');
  const callback = getToastEventCallback();

  callback({ type: 'unknown', message: 'Something' });

  expect(toastPushSpy).toHaveBeenCalledWith('Something', {
    pausable: true,
    theme: {},
  });
});
