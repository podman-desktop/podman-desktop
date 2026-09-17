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

/**
 * Environment variables set by the most common CI providers.
 * The four first ones are the generic variables also used by pnpm to detect a CI environment
 * (https://pnpm.io/cli/install#--frozen-lockfile), the others are provider specific and cover
 * the providers not setting any of the generic ones.
 */
export const CI_ENVIRONMENT_VARIABLES = [
  'CI',
  'CONTINUOUS_INTEGRATION',
  'BUILD_NUMBER',
  'RUN_ID',
  'APPVEYOR',
  'BITBUCKET_BUILD_NUMBER',
  'BUILDKITE',
  'CIRCLECI',
  'CODEBUILD_BUILD_ID',
  'DRONE',
  'GITHUB_ACTIONS',
  'GITLAB_CI',
  'HUDSON_URL',
  'JENKINS_URL',
  'SEMAPHORE',
  'TEAMCITY_VERSION',
  'TF_BUILD',
  'TRAVIS',
] as const;

// values explicitly opting out, a provider may define the variable while not running a build
const DISABLED_VALUES = ['', 'false', '0'];

@injectable()
export class CIDetection {
  /**
   * Detect if the current process is running inside a CI environment.
   * @param env the environment variables to inspect, defaults to the ones of the current process
   */
  isCIEnvironment(env: NodeJS.ProcessEnv = process.env): boolean {
    return CI_ENVIRONMENT_VARIABLES.some(name => {
      const value = env[name];
      return value !== undefined && !DISABLED_VALUES.includes(value.toLowerCase());
    });
  }
}
