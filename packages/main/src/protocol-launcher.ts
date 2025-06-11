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
import type { BrowserWindow } from 'electron';

import { isWindows } from '/@/util.js';

export class ProtocolLauncher {
  constructor(private browserWindow: PromiseWithResolvers<BrowserWindow>) {}

  /**
   * if arg starts with 'podman-desktop://extension', replace it with 'podman-desktop:extension'
   * @param url
   */
  sanitizeProtocolForExtension(url: string): string {
    if (url.startsWith('podman-desktop://extension/')) {
      url = url.replace('podman-desktop://extension/', 'podman-desktop:extension/');
    } else if (url.startsWith('podman-desktop://preferences/experimental')) {
      url = url.replace('podman-desktop://preferences/experimental', 'podman-desktop:experimental');
    }

    return url;
  }

  handleAdditionalProtocolLauncherArgs(args: ReadonlyArray<string>): void {
    // On Windows protocol handler will call the app with '<url>' args
    // on macOS it's done with 'open-url' event
    if (isWindows()) {
      // now search if we have 'open-url' in the list of args and give it to the handler
      for (const arg of args) {
        const analyzedArg = this.sanitizeProtocolForExtension(arg);
        if (analyzedArg.startsWith('podman-desktop:extension/')) {
          this.handleOpenUrl(analyzedArg);
        }
      }
    }
  }

  handleOpenUrl(url: string): void {
    // if the url starts with podman-desktop:extension/<id>
    // we need to install the extension

    // if url starts with 'podman-desktop://extension', replace it with 'podman-desktop:extension'
    url = this.sanitizeProtocolForExtension(url);

    console.log('>>>>>>>>> ' + url);

    if (url.startsWith('podman-desktop:extension/')) {
      // grab the extension id
      const extensionId = url.substring('podman-desktop:extension/'.length);

      // wait that the window is ready
      this.browserWindow.promise
        .then(w => {
          w.webContents.send('podman-desktop-protocol:install-extension', extensionId);
        })
        .catch((error: unknown) => {
          console.error('Error sending open-url event to webcontents', error);
        });
    } else if (url.startsWith('podman-desktop:experimental')) {
      this.browserWindow.promise
        .then(w => {
          w.webContents.send('podman-desktop-protocol:open-experimental-features');
        })
        .catch((error: unknown) => {
          console.error('Error sending open-url event to webcontents', error);
        });
    } else {
      console.log(`url ${url} does not start with podman-desktop:extension/, skipping.`);
      return;
    }
  }
}
