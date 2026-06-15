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

const AI_LAB_EXTENSION_ID = 'redhat.ai-lab';

export async function ensureExtensionPrerequisites(extensionId: string): Promise<void> {
  if (extensionId === AI_LAB_EXTENSION_ID) {
    await ensureAiLabDirectories();
  }
}

async function ensureAiLabDirectories(): Promise<void> {
  const huggingFaceCacheRoot = path.join(os.homedir(), '.cache', 'huggingface');
  const directories = [
    huggingFaceCacheRoot,
    path.join(huggingFaceCacheRoot, 'hub'),
    path.join(
      os.homedir(),
      '.local',
      'share',
      'containers',
      'podman-desktop',
      'extensions-storage',
      AI_LAB_EXTENSION_ID,
    ),
  ];

  for (const directory of directories) {
    await fs.promises.mkdir(directory, { recursive: true });
  }
}
