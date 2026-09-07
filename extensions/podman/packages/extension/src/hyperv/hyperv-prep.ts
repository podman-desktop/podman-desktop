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

import type { Disposable, TelemetryLogger } from '@podman-desktop/api';
import { commands, context, env, ProgressLocation, window } from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { compare, valid } from 'semver';

import { HYPERV_PREP_COMMAND, HYPERV_PREP_NOT_APPLIED_KEY, HYPERV_PREP_SUPPORTED_KEY } from '/@/constants';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { PodmanBinary } from '/@/utils/podman-binary';
import { execPodman } from '/@/utils/util';

export enum HyperVPrepStatus {
  NOT_APPLIED = 'notApplied',
  APPLIED = 'applied',
}

export interface HyperVPrepStatusResult {
  status: HyperVPrepStatus;
}

@injectable()
export class HyperVPrep {
  static readonly HYPERV_PREP_RELOGIN_MESSAGE =
    'Sign out of Windows and sign back in (or restart your computer) for Hyper-V Administrators group membership to take effect.';
  private static readonly PODMAN_MINIMUM_VERSION = '6.0.0';
  private static readonly MEMBERSHIP_HEADER = 'hyper-v administrators group membership:';

  @inject(PodmanBinary)
  private readonly podmanBinary!: PodmanBinary;

  @inject(TelemetryLoggerSymbol)
  private readonly telemetryLogger!: TelemetryLogger;

  #command: Disposable | undefined;
  #preparedThisSession = false;

  @postConstruct()
  init(): void {
    if (!env.isWindows) {
      return;
    }

    this.#command = commands.registerCommand(HYPERV_PREP_COMMAND, this.prepare.bind(this));
    // Keep Podman CLI checks off the extension activation critical path.
    this.refreshContext().catch((error: unknown) => {
      console.error('Error refreshing Hyper-V prep context', error);
    });
  }

  @preDestroy()
  dispose(): void {
    this.#command?.dispose();
    this.#command = undefined;
  }

  async isSupported(): Promise<boolean> {
    if (!env.isWindows) {
      return false;
    }

    const binaryInfo = await this.podmanBinary.getBinaryInfo();
    if (!binaryInfo) {
      return false;
    }

    const version = valid(binaryInfo.version);
    return version !== null && compare(version, HyperVPrep.PODMAN_MINIMUM_VERSION) >= 0;
  }

  async getStatus(): Promise<HyperVPrepStatusResult> {
    const result = await execPodman(['system', 'hyperv-prep', '--status']);
    return this.parseStatus(result.stdout);
  }

  /**
   * Parses output from `podman system hyperv-prep --status`, for example:
   * ```text
   * Hyper-V vsock registry entries:
   *   No vsock registry entries found.
   * Hyper-V Administrators group membership:
   *   Current user is NOT a member
   * ```
   */
  protected parseStatus(stdout: string): HyperVPrepStatusResult {
    const lines = stdout.split(/\r?\n/).map(line => line.trim());
    const membershipHeaderIndex = lines.findIndex(line => line.toLowerCase() === HyperVPrep.MEMBERSHIP_HEADER);
    const membership =
      membershipHeaderIndex === -1 ? undefined : lines.slice(membershipHeaderIndex + 1).find(line => line.length > 0);
    const isGroupMember = membership?.toLowerCase() === 'current user is a member';

    return {
      status: isGroupMember ? HyperVPrepStatus.APPLIED : HyperVPrepStatus.NOT_APPLIED,
    };
  }

  protected async run(): Promise<void> {
    await execPodman(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  }

  async refreshContext(): Promise<HyperVPrepStatusResult | undefined> {
    let supported = false;

    try {
      supported = await this.isSupported();
      context.setValue(HYPERV_PREP_SUPPORTED_KEY, supported);

      if (!supported) {
        context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
        return undefined;
      }

      const status = await this.getStatus();
      context.setValue(
        HYPERV_PREP_NOT_APPLIED_KEY,
        status.status === HyperVPrepStatus.NOT_APPLIED && !this.#preparedThisSession,
      );
      return status;
    } catch (error) {
      this.handleRefreshContextError(error, supported);
      return undefined;
    }
  }

  private handleRefreshContextError(error: unknown, supported: boolean): void {
    this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error });
    console.error('Failed to run podman system hyperv-prep --status', error);
    context.setValue(HYPERV_PREP_SUPPORTED_KEY, supported);
    context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, supported);
  }

  private async prepare(): Promise<void> {
    if (!(await this.isSupported())) {
      await window.showInformationMessage(
        `Hyper-V preparation requires Podman ${HyperVPrep.PODMAN_MINIMUM_VERSION} or later.`,
      );
      return;
    }

    try {
      const currentStatus = await this.getStatus();
      if (currentStatus.status === HyperVPrepStatus.APPLIED) {
        await window.showInformationMessage('Hyper-V preparation is already applied.');
        await this.refreshContext();
        return;
      }
    } catch (error) {
      console.error('Hyper-V preparation status check failed', error);
      this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error });
      const message = this.getErrorMessage(error, 'Unknown error while checking Hyper-V preparation status.');
      await window.showErrorMessage(`Hyper-V preparation status check failed: ${message}`);
      return;
    }

    const confirmation = await window.showInformationMessage(
      'Prepare Hyper-V now? Administrator approval (UAC) is required.',
      'Yes',
      'No',
    );
    if (confirmation !== 'Yes') {
      return;
    }

    try {
      await window.withProgress(
        {
          location: ProgressLocation.TASK_WIDGET,
          title: 'Preparing Hyper-V',
        },
        () => this.run(),
      );
    } catch (error) {
      console.error('Hyper-V preparation failed', error);
      this.telemetryLogger.logError('hypervPrepFailed', { error });
      const message = this.getErrorMessage(error, 'Unknown error while preparing Hyper-V.');
      await window.showErrorMessage(`Hyper-V preparation failed: ${message}`);
      return;
    }

    this.#preparedThisSession = true;
    const updatedStatus = await this.refreshContext();
    context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
    this.telemetryLogger.logUsage('podman.hypervPrep', { status: updatedStatus?.status ?? 'unknown' });
    if (!updatedStatus) {
      await window.showInformationMessage(
        `Hyper-V preparation completed successfully, but the status could not be confirmed.\n\n${HyperVPrep.HYPERV_PREP_RELOGIN_MESSAGE}`,
      );
      return;
    }

    await window.showInformationMessage(
      `Hyper-V preparation completed successfully.\n\n${HyperVPrep.HYPERV_PREP_RELOGIN_MESSAGE}`,
    );
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (
      error instanceof Error &&
      'stderr' in error &&
      typeof error.stderr === 'string' &&
      error.stderr.trim().length > 0
    ) {
      return error.stderr;
    }

    return error instanceof Error ? error.message || fallback : fallback;
  }
}
