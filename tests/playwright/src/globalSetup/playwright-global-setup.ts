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

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { setup } from './global-setup';

async function installChromium(): Promise<void> {
  const moduleRequire = createRequire(import.meta.url);
  const playwrightCli = moduleRequire.resolve('@playwright/test/cli');

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [playwrightCli, 'install', 'chromium'], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`playwright install chromium failed with exit code ${code}`));
      }
    });
  });
}

export default async function globalSetup(): Promise<void> {
  await installChromium();
  await setup();
}
