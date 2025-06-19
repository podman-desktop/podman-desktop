/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface PodmanInfo {
  podmanVersion?: string;
  lastUpdateCheck: number;
  ignoreVersionUpdate?: string;
}

export class PodmanInfoImpl implements PodmanInfo {
  private podmanInfo: PodmanInfo;

  constructor(
    podmanInfoValue: PodmanInfo | undefined,
    private readonly storagePath: string,
  ) {
    if (!podmanInfoValue) {
      this.podmanInfo = { lastUpdateCheck: 0 } as PodmanInfo;
    } else {
      this.podmanInfo = podmanInfoValue;
    }
  }

  set podmanVersion(version: string) {
    if (this.podmanInfo.podmanVersion !== version) {
      this.podmanInfo.podmanVersion = version;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  get podmanVersion(): string | undefined {
    return this.podmanInfo.podmanVersion;
  }

  set lastUpdateCheck(lastCheck: number) {
    if (this.podmanInfo.lastUpdateCheck !== lastCheck) {
      this.podmanInfo.lastUpdateCheck = lastCheck;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  get lastUpdateCheck(): number {
    return this.podmanInfo.lastUpdateCheck;
  }

  get ignoreVersionUpdate(): string | undefined {
    return this.podmanInfo.ignoreVersionUpdate;
  }

  set ignoreVersionUpdate(version: string) {
    if (this.podmanInfo.ignoreVersionUpdate !== version) {
      this.podmanInfo.ignoreVersionUpdate = version;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  private async writeInfo(): Promise<void> {
    try {
      const podmanInfoPath = path.resolve(this.storagePath, 'podman-ext.json');
      await writeFile(podmanInfoPath, JSON.stringify(this.podmanInfo));
    } catch (err) {
      console.error(err);
    }
  }
}
