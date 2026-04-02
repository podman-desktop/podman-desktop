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
import { ChromeDevToolsProtocolRunner } from '/@/runner/chrome-dev-tools-protocol-runner';
import { ElectronRunner } from '/@/runner/electron-runner';
import type { Runner } from '/@/runner/podman-desktop-runner';
import { RunnerOptions } from '/@/runner/runner-options';

export class RunnerFactory {
  protected static _instance: Runner | undefined;

  static async getInstance({
    runnerOptions = new RunnerOptions(),
  }: {
    runnerOptions?: RunnerOptions;
  } = {}): Promise<Runner> {
    if (!this._instance) {
      const pdArgs = process.env.PODMAN_DESKTOP_ARGS;
      const pdBinary = process.env.PODMAN_DESKTOP_BINARY;
      const debugPort = process.env.DEBUGGING_PORT;
      if (
        (pdArgs && !pdBinary && !debugPort) ||
        (pdBinary && !pdArgs && !debugPort) ||
        (!pdArgs && !pdBinary && !debugPort)
      ) {
        this._instance = new ElectronRunner({ runnerOptions });
      } else if (pdBinary && debugPort) {
        this._instance = new ChromeDevToolsProtocolRunner({ runnerOptions });
      } else {
        throw new Error(
          'Allowed combinations are standalone PODMAN_DESKTOP_ARGS or PODMAN_DESKTOP_BINARY or neither of them for electron runner. Or PODMAN_DESKTOP_BINARY and DEBUGGING_PORT for CDP runner...',
        );
      }
      await this._instance.start();
    }
    return this._instance;
  }

  static dispose(): void {
    this._instance = undefined;
  }
}
