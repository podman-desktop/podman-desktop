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
import os from 'node:os';

import extensionApi from '@podman-desktop/api';
import { inject } from 'inversify';

import { LibkrunPodmanVersionCheck } from '/@/checks/macos/libkrun-podman-version-check';

export class MacOSPlatform {
  readonly type = 'macOS';

  constructor(
    @inject(LibkrunPodmanVersionCheck)
    private readonly libbkrunPodmanVersionCheck: LibkrunPodmanVersionCheck,
  ) {}

  async isLibkrunSupported(): Promise<boolean> {
    if (!extensionApi.env.isMac || os.arch() !== 'arm64') {
      return false;
    }

    const result = await this.libbkrunPodmanVersionCheck.execute();
    return result.successful;
  }
}
