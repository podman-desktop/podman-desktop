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

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { expect as playExpect, test } from '/@/utility/fixtures';
import { calculateInstallerChecksum, getInstallerChecksum, getInstallerPaths } from '/@/utility/installer-checksums';

const checksumPath = process.env.TEST_INSTALLER_CHECKSUMS;
const installerPath = process.env.TEST_INSTALLER_PATH;

test.describe('Installer checksum verification', { tag: ['@installer-checksums', '@update-install'] }, () => {
  test('Downloaded installers match their published SHA256 checksums', async () => {
    test.skip(!checksumPath && !installerPath, 'Requires TEST_INSTALLER_CHECKSUMS and TEST_INSTALLER_PATH');
    if (!checksumPath || !installerPath) {
      throw new Error('Both TEST_INSTALLER_CHECKSUMS and TEST_INSTALLER_PATH must be set');
    }

    const manifest = await readFile(checksumPath, 'utf-8');
    const installers = await getInstallerPaths(installerPath, checksumPath);
    const fileList = installers.map(file => `  - ${file}`).join('\n');
    console.log(`Files selected for SHA256 verification against ${checksumPath}:\n${fileList}`);
    for (const installer of installers) {
      await test.step(`Verify SHA256: ${path.basename(installer)}`, async () => {
        const expected = getInstallerChecksum(manifest, path.basename(installer));
        const actual = await calculateInstallerChecksum(installer);
        playExpect(actual, `SHA256 checksum for ${installer} (manifest: ${checksumPath})`).toBe(expected);
      });
    }
  });
});
