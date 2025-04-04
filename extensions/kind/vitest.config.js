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

import { join, resolve } from 'node:path';
import { defineProject } from 'vitest/config';

const PACKAGE_ROOT = __dirname;
const WORKSPACE_ROOT = join(PACKAGE_ROOT, '..', '..');

export default defineProject({
  root: PACKAGE_ROOT,
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    alias: {
      '@podman-desktop/api': resolve(WORKSPACE_ROOT, '__mocks__/@podman-desktop/api.js'),
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
});
