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
import { configuration as configurationAPI, Disposable } from '@podman-desktop/api';
import { injectable, postConstruct, preDestroy } from 'inversify';

import { execPodman } from '/@/utils/util';

export interface InstalledPodman {
  version: string;
}

@injectable()
export class PodmanBinary implements Disposable {
  #cli: InstalledPodman | undefined = undefined;
  #configurationDisposable: Disposable | undefined = undefined;

  /**
   * Given a path to a podman binary, return the version of podman
   */
  protected async getPodmanVersion(): Promise<string> {
    const { stdout: versionOut } = await execPodman(['--version']);
    const versionArr = versionOut.split(' ');
    return versionArr[versionArr.length - 1];
  }

  public invalidate(): void {
    this.#cli = undefined;
  }

  /**
   * The result will be undefined when we can't find podman installation
   */
  public async getBinaryInfo(): Promise<InstalledPodman | undefined> {
    if (this.#cli) {
      return this.#cli;
    }

    try {
      const version = await this.getPodmanVersion();
      this.#cli = {
        version,
      };
      return this.#cli;
    } catch (err: unknown) {
      // no podman binary
      return undefined;
    }
  }

  @postConstruct()
  init(): void {
    /**
     * If the user changed the podman binary path, we need to invalidate the cache
     */
    this.#configurationDisposable = configurationAPI.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('podman.binary.path')) {
        this.invalidate();
      }
    });
  }

  @preDestroy()
  dispose(): void {
    this.#configurationDisposable?.dispose();
    this.#configurationDisposable = undefined;
  }
}
