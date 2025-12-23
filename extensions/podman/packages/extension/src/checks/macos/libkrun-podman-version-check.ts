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
import { CheckResult } from '@podman-desktop/api';
import { compareVersions } from 'compare-versions';
import { inject, injectable } from 'inversify';

import { PodmanBinary } from '/@/utils/podman-binary';

import { BaseCheck } from '../base-check';

@injectable()
export class LibkrunPodmanVersionCheck extends BaseCheck {
  title = 'Minimum Podman Version for Libkrun';
  static readonly PODMAN_MINIMUM_VERSION_FOR_LIBKRUN_SUPPORT = '5.2.0-rc1';

  constructor(
    @inject(PodmanBinary)
    private readonly podmanBinary: PodmanBinary,
  ) {
    super();
  }

  async execute(): Promise<CheckResult> {
    const isPodmanVersionSupported = await this.isPodmanVersionSupported();
    if (!isPodmanVersionSupported) {
      return this.createFailureResult({
        description: `Libkrun is only supported with podman version >= ${LibkrunPodmanVersionCheck.PODMAN_MINIMUM_VERSION_FOR_LIBKRUN_SUPPORT}.`,
      });
    }
    return this.createSuccessfulResult();
  }

  private async isPodmanVersionSupported(): Promise<boolean> {
    const binaryInfo = await this.podmanBinary.getBinaryInfo();
    if (!binaryInfo) return false;
    return (
      compareVersions(binaryInfo?.version, LibkrunPodmanVersionCheck.PODMAN_MINIMUM_VERSION_FOR_LIBKRUN_SUPPORT) >= 0
    );
  }
}
