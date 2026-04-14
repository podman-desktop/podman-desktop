/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { expect, test } from 'vitest';

import { GITHUB_OWNER, GITHUB_REPOSITORY, REPOSITORY_HOMEPAGE, REPOSITORY_URL } from './repository-infos.js';

test('check constants correctly extracted from package.json', async () => {
  expect(REPOSITORY_URL).toBe('https://github.com/podman-desktop/podman-desktop');
  expect(REPOSITORY_HOMEPAGE).toBe('https://www.podman-desktop.io');
  expect(GITHUB_OWNER).toBe('podman-desktop');
  expect(GITHUB_REPOSITORY).toBe('podman-desktop');
});
