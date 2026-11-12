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

import type { CheckResult } from '@podman-desktop/api';
import { injectable } from 'inversify';
import { coerce, lt } from 'semver';

import { BaseCheck } from '/@/checks/base-check';
import { WslHelper } from '/@/helpers/wsl-helper';
import { getBundledPodmanVersion } from '/@/utils/podman-bundled';

/**
 * Checks that the installed WSL version supports a given Podman version.
 *
 * Podman 6 dropped iptables and cgroups v1 support and WSL only supports nftables since 2.7.5,
 * so WSL machines fail to start or to run containers with older WSL versions.
 * See https://github.com/podman-container-tools/podman/discussions/30117
 */
@injectable()
export class WSLPodmanVersionCheck extends BaseCheck {
  static readonly MINIMUM_WSL_VERSION_FOR_PODMAN_6 = '2.7.5';

  title = 'WSL Version for Podman';

  /**
   * Checks the installed WSL against the Podman version bundled with Podman Desktop (install and update preflight checks).
   */
  async execute(): Promise<CheckResult> {
    return this.executeFor(getBundledPodmanVersion());
  }

  /**
   * Checks the installed WSL against the given Podman version.
   */
  async executeFor(podmanVersion: string): Promise<CheckResult> {
    // coerce so that pre-releases (e.g. 6.0.0-rc1) are handled as the final version
    const coercedPodmanVersion = coerce(podmanVersion);
    if (!coercedPodmanVersion || lt(coercedPodmanVersion, '6.0.0')) {
      return this.createSuccessfulResult();
    }

    // not memoized so that a WSL update is detected
    const wslVersion = await this.getWSLVersion();
    const coercedWSLVersion = coerce(wslVersion);
    // the WSL version can't be read: WSLVersionCheck already reports that case
    if (!coercedWSLVersion) {
      return this.createSuccessfulResult();
    }

    const minimumWSLVersion = WSLPodmanVersionCheck.MINIMUM_WSL_VERSION_FOR_PODMAN_6;
    if (!lt(coercedWSLVersion, minimumWSLVersion)) {
      return this.createSuccessfulResult();
    }

    return this.createFailureResult({
      description: `Podman ${podmanVersion} requires WSL ${minimumWSLVersion} or later, but WSL ${wslVersion} is installed. WSL machines will fail to start or to run containers.`,
      docLinksDescription: `Run 'wsl --update' in a terminal to update WSL. If you do not have access to the Microsoft Store, run 'wsl --update --web-download'. Otherwise, use the Hyper-V provider or an older Podman version.`,
    });
  }

  private async getWSLVersion(): Promise<string | undefined> {
    try {
      return (await new WslHelper().getWSLVersionData()).wslVersion;
    } catch (error: unknown) {
      console.debug('Unable to read the WSL version', error);
      return undefined;
    }
  }
}
