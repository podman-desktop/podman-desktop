/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import { mergeConfig } from 'vite';
import baseConfig from '../../../vite.base.config';

export default mergeConfig(baseConfig, {
  root: __dirname,
  resolve: {
    alias: {
      '/@/': join(__dirname, 'src') + '/',
    },
  },
  build: {
    rollupOptions: {
      external: ['ssh2', '@podman-desktop/podman-extension-api'],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
  },
  test: {
    include: ['{src,scripts}/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
