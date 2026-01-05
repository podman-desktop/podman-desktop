/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import type { CheckResult, ExtensionContext, RunError } from '@podman-desktop/api';
import { commands, process } from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';
import { ExtensionContextSymbol } from '/@/inject/symbols';
import { normalizeWSLOutput } from '/@/utils/util';

import { UserAdminCheck } from './user-admin-check';

@injectable()
export class WSL2Check extends MemoizedBaseCheck {
  title = 'WSL2 Installed';
  installWSLCommandId = 'podman.onboarding.installWSL';

  constructor(
    @inject(UserAdminCheck)
    private userAdminCheck: UserAdminCheck,
    @inject(ExtensionContextSymbol)
    private extensionContext?: ExtensionContext,
  ) {
    super();
  }

  async init(): Promise<void> {
    if (this.extensionContext) {
      const wslCommand = commands.registerCommand(this.installWSLCommandId, async () => {
        const installSucceeded = await this.installWSL();
        if (installSucceeded) {
          // if action succeeded, do a re-check of all podman requirements so user can be moved forward if all missing pieces have been installed
          await commands.executeCommand('podman.onboarding.checkRequirementsCommand');
        }
      });
      this.extensionContext.subscriptions.push(wslCommand);
    }
  }

  async executeImpl(): Promise<CheckResult> {
    try {
      const isWSL = await this.isWSLPresent();
      const isRebootNeeded = await this.isRebootNeeded();

      if (!isWSL) {
        const userAdminResult = await this.userAdminCheck.execute();
        if (userAdminResult.successful) {
          return this.createFailureResult({
            description: 'WSL2 is not installed.',
            docLinksDescription: `Call 'wsl --install --no-distribution' in a terminal.`,
            docLinks: {
              url: 'https://learn.microsoft.com/en-us/windows/wsl/install',
              title: 'WSL2 Manual Installation Steps',
            },
            fixCommand: {
              id: this.installWSLCommandId,
              title: 'Install WSL2',
            },
          });
        } else {
          return this.createFailureResult({
            description: 'WSL2 is not installed or you do not have permissions to run WSL2.',
            docLinksDescription: 'Contact your Administrator to setup WSL2.',
            docLinks: {
              url: 'https://learn.microsoft.com/en-us/windows/wsl/install',
              title: 'WSL2 Manual Installation Steps',
            },
          });
        }
      } else if (isRebootNeeded) {
        return this.createFailureResult({
          description:
            'WSL2 seems to be installed but the system needs to be restarted so the changes can take effect.',
          docLinksDescription: `If already restarted, call 'wsl --install --no-distribution' in a terminal.`,
          docLinks: {
            url: 'https://learn.microsoft.com/en-us/windows/wsl/install',
            title: 'WSL2 Manual Installation Steps',
          },
        });
      }
    } catch (err) {
      return this.createFailureResult({
        description: 'Could not detect WSL2',
        docLinks: {
          url: 'https://learn.microsoft.com/en-us/windows/wsl/install',
          title: 'WSL2 Manual Installation Steps',
        },
      });
    }

    return this.createSuccessfulResult();
  }

  private async isWSLPresent(): Promise<boolean> {
    try {
      const { stdout: res } = await process.exec('wsl', ['--set-default-version', '2'], {
        env: { WSL_UTF8: '1' },
      });
      const output = normalizeWSLOutput(res);
      return !!output;
    } catch (error) {
      return false;
    }
  }

  private async installWSL(): Promise<boolean> {
    try {
      await process.exec('wsl', ['--install', '--no-distribution'], {
        env: { WSL_UTF8: '1' },
      });

      return true;
    } catch (error) {
      const runError = error as RunError;
      let message = runError.message ? `${runError.message}\n` : '';
      message += runError.stdout || '';
      message += runError.stderr || '';
      throw new Error(message);
    }
  }

  private async isRebootNeeded(): Promise<boolean> {
    try {
      await process.exec('wsl', ['-l'], {
        env: { WSL_UTF8: '1' },
      });
    } catch (error) {
      // we only return true for the WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED error code
      // as other errors may not be connected to a reboot, like
      // WSL_E_DEFAULT_DISTRO_NOT_FOUND = wsl was installed without the default distro
      const runError = error as RunError;
      if (runError.stdout.includes('Wsl/WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED')) {
        return true;
      } else if (
        runError.stdout.includes('Wsl/WSL_E_DEFAULT_DISTRO_NOT_FOUND') ||
        runError.stdout.includes('Windows Subsystem for Linux has no installed distributions')
      ) {
        // Previously the stdout has contained the "Wsl/WSL_E_DEFAULT_DISTRO_NOT_FOUND" text,
        // now it is no longer true
        // treating this log differently as we install wsl without any distro
        console.log('WSL has been installed without the default distribution');
      } else {
        console.error(error);
      }
    }
    return false;
  }
}
