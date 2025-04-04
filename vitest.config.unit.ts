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
  '**/cypress/**',
  '**/dist/**',
  '**/node_modules/**',
  '**/.{cache,git,idea,output,temp,cdix}/**',
  '**/*{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tailwind,postcss}.config.*',
];

/**
 * vitest workspace configuration for unit tests
 */
export default defineConfig({
  test: {
    workspace: [
      // packages
      'packages/*/vitest.config.ts',
      // simple extensions
      'extensions/*/vitest.config.ts',
      // multi packages extensions
      'extensions/*/packages/*/vitest.config.ts',
      // website
      'website/vitest.config.ts',
      // tools
      'tools/vitest.config.ts',
      // scripts
      'scripts/vitest.config.ts',
      // storybook
      'storybook/vitest.config.ts',
    ],
    // use GitHub action reporters when running in CI
    reporters: process.env.CI ? [['junit', { includeConsoleOutput: false }]] : ['default'],
    outputFile: process.env.CI ? { junit: 'coverage/junit-results.xml' } : {},
    coverage: {
      all: false,
      clean: true,
      excludeAfterRemap: true,
      provider: 'v8',
      reporter: process.env.CI ? ['json'] : ['lcov', 'text'],
      exclude: [
        ...configDefaults.coverage.exclude,
        ...PODMAN_DESKTOP_EXCLUDED,
      ],
    },
    exclude: [
      ...configDefaults.exclude,
      ...PODMAN_DESKTOP_EXCLUDED,
    ]
  },
});
