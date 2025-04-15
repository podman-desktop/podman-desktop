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
import { configDefaults, defineConfig } from 'vitest/config';

const PODMAN_DESKTOP_EXCLUDED = [
  '**/builtin/**',
  '**/dist/**',
  '**/.{cache,git,idea,output,temp,cdix}/**',
  '**/*.cdix/**',
];

/**
 * vitest workspace configuration for unit tests
 */
export default defineConfig({
  test: {
    workspace: [
      '{extensions,packages,tools,storybook,website,scripts}/**/{vitest,vite}.config.{js,ts}',
      '!**/builtin/**',
    ],
    // use GitHub action reporters when running in CI
    reporters: process.env.CI ? [['junit', { includeConsoleOutput: false }], 'default'] : ['default'],
    outputFile: process.env.CI ? { junit: 'coverage/junit-results.xml' } : {},
    coverage: {
      all: true,
      clean: true,
      excludeAfterRemap: true,
      provider: 'v8',
      reporter: process.env.CI ? ['json'] : ['lcov', 'text'],
      include: [
        // projects with sources in src folder
        '{extensions,packages,tools,storybook}/**/{src,scripts}/**',
        // projects with sources at root
        '{website,scripts}/*',
      ],
      exclude: [...configDefaults.coverage.exclude, ...PODMAN_DESKTOP_EXCLUDED],
    },
    exclude: [...configDefaults.exclude, ...PODMAN_DESKTOP_EXCLUDED],
  },
});
