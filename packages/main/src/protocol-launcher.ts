/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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
import type { BrowserWindow } from 'electron';

import { isWindows } from '/@/util.js';
import product from '/@product.json' with { type: 'json' };

export class ProtocolLauncher {
  private readonly protocol = product.urlProtocol;

  constructor(private browserWindow: PromiseWithResolvers<BrowserWindow>) {}

  /**
   * if arg starts with '<protocol>://extension', replace it with '<protocol>:extension'
   * @param url
   */
  sanitizeProtocolForExtension(url: string): string {
    const doubleSlashPrefix = `${this.protocol}://`;
    const singleColonPrefix = `${this.protocol}:`;

    if (url.startsWith(`${doubleSlashPrefix}extension/`)) {
      return url.replace(`${doubleSlashPrefix}extension/`, `${singleColonPrefix}extension/`);
    } else if (url.startsWith(`${doubleSlashPrefix}preferences/experimental`)) {
      return url.replace(`${doubleSlashPrefix}preferences/experimental`, `${singleColonPrefix}experimental`);
    }

    return url;
  }

  handleAdditionalProtocolLauncherArgs(args: ReadonlyArray<string>): void {
    // On Windows protocol handler will call the app with '<url>' args
    // on macOS it's done with 'open-url' event
    if (isWindows()) {
      const extensionPrefix = `${this.protocol}:extension/`;
      const experimentalPrefix = `${this.protocol}:experimental`;

      for (const arg of args) {
        const analyzedArg = this.sanitizeProtocolForExtension(arg);
        if (analyzedArg.startsWith(extensionPrefix) || analyzedArg.startsWith(experimentalPrefix)) {
          this.handleOpenUrl(analyzedArg);
        }
      }
    }
  }

  handleOpenUrl(url: string): void {
    // if the url starts with ${this.protocol}:extension/<id>
    // we need to install the extension

    // if url starts with '${this.protocol}://extension', replace it with '${this.protocol}:extension'
    const normalizedUrl = this.sanitizeProtocolForExtension(url);

    const extensionPrefix = `${this.protocol}:extension/`;
    const experimentalPrefix = `${this.protocol}:experimental`;

    if (normalizedUrl.startsWith(extensionPrefix)) {
      const extensionId = normalizedUrl.substring(extensionPrefix.length);

      this.browserWindow.promise
        .then(w => {
          w.webContents.send('podman-desktop-protocol:install-extension', extensionId);
        })
        .catch((error: unknown) => {
          console.error('Error sending open-url event to webcontents', error);
        });
    } else if (normalizedUrl.startsWith(experimentalPrefix)) {
      this.browserWindow.promise
        .then(w => {
          w.webContents.send('podman-desktop-protocol:open-experimental-features');
        })
        .catch((error: unknown) => {
          console.error('Error sending open-url event to webcontents', error);
        });
    } else {
      console.log(`url ${normalizedUrl} does not start with ${extensionPrefix} or ${experimentalPrefix}, skipping.`);
      return;
    }
  }
}
