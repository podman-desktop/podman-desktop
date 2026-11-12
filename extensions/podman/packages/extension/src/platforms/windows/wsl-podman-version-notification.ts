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

import type { Disposable } from '@podman-desktop/api';
import { window } from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';

import { WSLPodmanVersionCheck } from '/@/checks/windows/wsl-podman-version-check';
import { PodmanProvider } from '/@/providers/podman-provider';
import { PodmanBinary } from '/@/utils/podman-binary';

/**
 * Notifies Windows users when the installed WSL version is too old for the installed Podman version.
 */
@injectable()
export class WSLPodmanVersionNotification {
  @inject(PodmanBinary)
  private readonly podmanBinary!: PodmanBinary;

  @inject(PodmanProvider)
  private readonly podmanProvider!: PodmanProvider;

  @inject(WSLPodmanVersionCheck)
  private readonly wslPodmanVersionCheck!: WSLPodmanVersionCheck;

  #updateVersionListener: Disposable | undefined;
  #notification: Disposable | undefined;

  @postConstruct()
  init(): void {
    this.#updateVersionListener = this.podmanProvider.provider.onDidUpdateVersion(() => {
      // drop the cached version before reading it (see HyperVPrep)
      this.podmanBinary.invalidate();
      this.refresh().catch(console.error);
    });
    // do not block the extension activation on the `wsl --version` call
    this.refresh().catch(console.error);
  }

  @preDestroy()
  dispose(): void {
    this.#updateVersionListener?.dispose();
    this.#updateVersionListener = undefined;
    this.#notification?.dispose();
    this.#notification = undefined;
  }

  async refresh(): Promise<void> {
    this.#notification?.dispose();
    this.#notification = undefined;

    const podmanVersion = (await this.podmanBinary.getBinaryInfo())?.version;
    if (!podmanVersion) {
      return;
    }

    const result = await this.wslPodmanVersionCheck.executeFor(podmanVersion);
    if (result.successful) {
      return;
    }

    this.#notification = window.showNotification({
      title: `WSL update required for Podman ${podmanVersion}`,
      body: `${result.description} ${result.docLinksDescription}`,
      type: 'warn',
      highlight: true,
      silent: true,
    });
  }
}
