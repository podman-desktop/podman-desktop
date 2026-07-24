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

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { ensureExtensionPrerequisites } from './extension-prerequisites';

describe('extension-prerequisites', () => {
  const huggingFaceCacheRoot = path.join(os.homedir(), '.cache', 'huggingface');
  const huggingFaceHubDir = path.join(huggingFaceCacheRoot, 'hub');
  let cacheExisted = false;

  beforeEach(() => {
    cacheExisted = fs.existsSync(huggingFaceHubDir);
    if (fs.existsSync(huggingFaceCacheRoot)) {
      fs.rmSync(huggingFaceCacheRoot, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (!cacheExisted && fs.existsSync(huggingFaceCacheRoot)) {
      fs.rmSync(huggingFaceCacheRoot, { recursive: true, force: true });
    }
  });

  test('creates huggingface cache directories for Podman AI Lab', async () => {
    const storageDir = path.join(
      os.homedir(),
      '.local',
      'share',
      'containers',
      'podman-desktop',
      'extensions-storage',
      'redhat.ai-lab',
    );
    const huggingFaceHubDir = path.join(os.homedir(), '.cache', 'huggingface', 'hub');

    if (fs.existsSync(storageDir)) {
      fs.rmSync(storageDir, { recursive: true, force: true });
    }

    expect(fs.existsSync(huggingFaceHubDir)).toBe(false);

    await ensureExtensionPrerequisites('redhat.ai-lab');

    expect(fs.existsSync(huggingFaceHubDir)).toBe(true);
    expect(fs.existsSync(storageDir)).toBe(true);
  });

  test('ignores unrelated extensions', async () => {
    await ensureExtensionPrerequisites('podman-desktop.podman');

    expect(fs.existsSync(huggingFaceHubDir)).toBe(false);
  });
});
