/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import * as fs from 'node:fs';
import * as os from 'node:os';

export const isLinux = os.platform() === 'linux';
export const isMac = os.platform() === 'darwin';
export const isWindows = os.platform() === 'win32';
export const archType = os.arch();

// powershell $true value is 'True', we need to make it a lowercase first
export const isCI = String(process.env.CI).toLowerCase() === 'true';

function detectRHEL(): boolean {
  if (os.platform() !== 'linux') return false;
  try {
    // eslint-disable-next-line n/no-sync
    const content = fs.readFileSync('/etc/os-release', 'utf-8');
    return /^ID="?rhel"?$/m.test(content);
  } catch {
    return false;
  }
}

export const isRHEL = detectRHEL();
