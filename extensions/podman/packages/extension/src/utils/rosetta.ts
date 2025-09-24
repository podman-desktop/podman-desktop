/*********************************************************************
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
 ********************************************************************/

import { arch } from 'node:os';

import type { RunError } from '@podman-desktop/api';
import { env, process as processAPI, window } from '@podman-desktop/api';

import type { PodmanConfiguration } from './podman-configuration';

export async function checkRosettaMacArm(podmanConfiguration: PodmanConfiguration): Promise<void> {
  // check that rosetta is there for macOS / arm as the machine may fail to start
  if (env.isMac && arch() === 'arm64') {
    const isEnabled = await podmanConfiguration.isRosettaEnabled();
    if (isEnabled) {
      // call the command `arch -arch x86_64 uname -m` to check if rosetta is enabled
      // if not installed, it will fail
      try {
        await processAPI.exec('arch', ['-arch', 'x86_64', 'uname', '-m']);
      } catch (error: unknown) {
        const runError = error as RunError;
        if (runError.stderr?.includes('Bad CPU')) {
          // rosetta is enabled but not installed, it will fail, stop from there and prompt the user to install rosetta or disable rosetta support
          const result = await window.showInformationMessage(
            'Podman machine is configured to use Rosetta but the support is not installed. The startup of the machine will fail.\nDo you want to install Rosetta? Rosetta is allowing to execute amd64 images on Apple silicon architecture.',
            'Yes',
            'No',
            'Disable rosetta support',
          );
          if (result === 'Yes') {
            // ask the person to perform the installation using cli
            await window.showInformationMessage(
              'Please install Rosetta from the command line by running `softwareupdate --install-rosetta`',
            );
          } else if (result === 'Disable rosetta support') {
            await podmanConfiguration.updateRosettaSetting(false);
          }
        }
      }
    }
  }
}
