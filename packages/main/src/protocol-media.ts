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

import { extname } from 'node:path';

import type { App as ElectronApp, Net as ElectronNet, Protocol as ElectronProtocol } from 'electron';

const MEDIA_ALLOWED = new Set<string>(['.woff2']);

export class ProtocolMedia {
  #app: ElectronApp;
  #net: ElectronNet;
  #protocol: ElectronProtocol;

  constructor(app: ElectronApp, net: ElectronNet, protocol: ElectronProtocol) {
    this.#app = app;
    this.#net = net;
    this.#protocol = protocol;
  }

  public init(): void {
    this.#app
      .whenReady()
      .then(() => {
        this.#protocol.handle('media', this.handle.bind(this));
      })
      .catch(console.error);
  }

  /**
   * Validate a path based on the allowed extensions
   * @param path
   * @private
   */
  private validate(path: string): boolean {
    return MEDIA_ALLOWED.has(extname(path));
  }

  /**
   * Callback for {@link ElectronProtocol#handle}
   * @remarks do not use directly
   * @param request
   * @private
   */
  private handle(request: Request): Promise<GlobalResponse> {
    const parsed: URL = new URL(request.url);
    if (parsed.protocol !== 'media:') throw new Error(`invalid protocol: expected media: got ${parsed.protocol}`);

    if (!this.validate(parsed.href))
      throw new Error(
        `invalid path: trying to read media ${parsed.href}, extension allowed: ${Array.from(MEDIA_ALLOWED.values()).join(',')}`,
      );
    return this.#net.fetch(`file://${parsed.pathname}`);
  }
}
