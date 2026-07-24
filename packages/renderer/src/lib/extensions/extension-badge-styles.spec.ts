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

import { describe, expect, test } from 'vitest';

import { buildExtensionBugReportUrl } from './extension-badge-styles';

describe('buildExtensionBugReportUrl', () => {
  test('returns podman-desktop fallback when repository url is missing', () => {
    expect(buildExtensionBugReportUrl()).toBe('https://github.com/podman-desktop/podman-desktop/issues/new');
  });

  test('builds issues url from extension repository url', () => {
    expect(buildExtensionBugReportUrl('https://github.com/podman-desktop/extensions/tree/main/extensions/podman')).toBe(
      'https://github.com/podman-desktop/extensions/issues/new',
    );
  });

  test('returns issues url unchanged when already an issues link', () => {
    const url = 'https://github.com/podman-desktop/podman-desktop/issues/new';
    expect(buildExtensionBugReportUrl(url)).toBe(url);
  });
});
