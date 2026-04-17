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
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Singleton pattern> */
import { ChromeDevToolsProtocolRunner } from '/@/runner/chrome-dev-tools-protocol-runner';
import { ElectronRunner } from '/@/runner/electron-runner';
import type { Runner } from '/@/runner/podman-desktop-runner';
import { RunnerOptions } from '/@/runner/runner-options';

export class RunnerFactory {
  private static _instance: Runner | undefined;
  private static _initializing: Promise<Runner> | undefined;

  static async getInstance(runnerOptions?: RunnerOptions): Promise<Runner> {
    if (RunnerFactory._instance) return RunnerFactory._instance;
    if (RunnerFactory._initializing) return RunnerFactory._initializing;

    RunnerFactory._initializing = RunnerFactory.create(runnerOptions ?? new RunnerOptions());
    try {
      RunnerFactory._instance = await RunnerFactory._initializing;
      return RunnerFactory._instance;
    } finally {
      RunnerFactory._initializing = undefined;
    }
  }

  private static async create(runnerOptions: RunnerOptions): Promise<Runner> {
    const runner = RunnerFactory.resolveRunner(runnerOptions);
    await runner.start();
    return runner;
  }

  private static resolveRunner(runnerOptions: RunnerOptions): Runner {
    const pdArgs = process.env.PODMAN_DESKTOP_ARGS;
    const pdBinary = process.env.PODMAN_DESKTOP_BINARY;
    const debugPort = process.env.DEBUGGING_PORT;

    if (pdArgs && pdBinary) {
      throw new Error('PODMAN_DESKTOP_ARGS and PODMAN_DESKTOP_BINARY are mutually exclusive');
    }
    if (pdArgs && debugPort) {
      throw new Error('DEBUGGING_PORT requires PODMAN_DESKTOP_BINARY, not PODMAN_DESKTOP_ARGS');
    }
    if (debugPort && !pdBinary) {
      throw new Error('DEBUGGING_PORT requires PODMAN_DESKTOP_BINARY to be set');
    }

    if (pdBinary && debugPort) {
      return new ChromeDevToolsProtocolRunner({ runnerOptions });
    }
    return new ElectronRunner({ runnerOptions });
  }

  static dispose(): void {
    RunnerFactory._instance = undefined;
    RunnerFactory._initializing = undefined;
  }
}
