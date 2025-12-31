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

import type { App as ElectronApp } from 'electron';

import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { product } from '/@/product.js';
import { isWindows } from '/@/util.js';

/**
 * Configures the application as the default protocol client for handling {@link product.urlProtocol} (e.g. 'podman-desktop') protocol links.
 */
export class DefaultProtocolClient implements AppPlugin {
  constructor(private readonly app: ElectronApp) {}

  async onReady(): Promise<void> {
    if (!import.meta.env.PROD) return;

    if (isWindows()) {
      this.app.setAsDefaultProtocolClient(product.urlProtocol, process.execPath, process.argv);
    } else {
      this.app.setAsDefaultProtocolClient(product.urlProtocol);
    }
  }

  dispose(): void {}
}
