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

import { join } from 'node:path';

import mainConfig from '../../../packages/main/vite.config.js';

const build = mainConfig.build;
if (!build?.lib || !Array.isArray(build.lib.entry)) {
  throw new Error('The E2E bootstrap requires the main library entry points to be an array');
}

export default {
  ...mainConfig,
  build: {
    ...build,
    lib: {
      ...build.lib,
      entry: build.lib.entry.map(entry => (entry === 'src/index.ts' ? join(__dirname, 'index.ts') : entry)),
    },
  },
  test: {
    ...mainConfig.test,
    name: 'e2e-bootstrap',
    include: [join(__dirname, '*.spec.ts')],
  },
};
