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

import {
  canToggleExtensionLifecycle,
  getExtensionLifecycleToggleAction,
  getExtensionLifecycleToggleLabel,
  isExtensionLifecycleEnabled,
} from './extension-lifecycle-toggle';

describe('extension-lifecycle-toggle', () => {
  test('labels enabled extensions as Disable', () => {
    expect(getExtensionLifecycleToggleLabel('started')).toBe('Disable');
    expect(getExtensionLifecycleToggleLabel('starting')).toBe('Disable');
  });

  test('labels disabled extensions as Enable', () => {
    expect(getExtensionLifecycleToggleLabel('stopped')).toBe('Enable');
    expect(getExtensionLifecycleToggleLabel('failed')).toBe('Enable');
    expect(getExtensionLifecycleToggleLabel('stopping')).toBe('Enable');
  });

  test('allows toggling from stable states only', () => {
    expect(canToggleExtensionLifecycle('started')).toBe(true);
    expect(canToggleExtensionLifecycle('starting')).toBe(true);
    expect(canToggleExtensionLifecycle('stopped')).toBe(true);
    expect(canToggleExtensionLifecycle('failed')).toBe(true);
    expect(canToggleExtensionLifecycle('stopping')).toBe(false);
  });

  test('maps lifecycle state to start/stop actions', () => {
    expect(getExtensionLifecycleToggleAction('started')).toBe('stop');
    expect(getExtensionLifecycleToggleAction('stopped')).toBe('start');
    expect(isExtensionLifecycleEnabled('started')).toBe(true);
    expect(isExtensionLifecycleEnabled('stopped')).toBe(false);
  });
});
