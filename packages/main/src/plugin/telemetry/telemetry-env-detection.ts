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

import { injectable } from 'inversify';

import { CIDetection } from './ci-detection.js';

@injectable()
export class TelemetryEnvDetection {
  /**
   * Environment variable turning telemetry off for the current run.
   */
  static readonly DISABLE_TELEMETRY_VARIABLE = 'PODMAN_DESKTOP_DISABLE_TELEMETRY';

  /**
   * Detect if telemetry has been turned off through the environment.
   * The variable is read the same way as the CI ones: an empty value, false or 0 are ignored.
   * @param env the environment variables to inspect, defaults to the ones of the current process
   */
  isTelemetryDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
    return CIDetection.isVariableSet(env, TelemetryEnvDetection.DISABLE_TELEMETRY_VARIABLE);
  }
}
