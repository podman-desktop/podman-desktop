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

export type HyperVPrepStatus = 'notApplied' | 'applied';

export interface HyperVPrepStatusResult {
  status: HyperVPrepStatus;
}

@injectable()
export class HyperVPrep {
  static readonly HYPERV_PREP_RELOGIN_MESSAGE =
    'Sign out of Windows and sign back in (or restart your computer) for Hyper-V Administrators group membership to take effect.';
  static readonly podmanMinimumVersionForHyperVPrep = '6.0.0';
  private static readonly MEMBERSHIP_HEADER = 'hyper-v administrators group membership:';

  @inject(PodmanBinary)
  private readonly podmanBinary!: PodmanBinary;

  @inject(TelemetryLoggerSymbol)
  private readonly telemetryLogger!: TelemetryLogger;

  #command: Disposable | undefined;

  @postConstruct()
  init(): void {
    if (!env.isWindows) {
      return;
    }

    this.#command = commands.registerCommand(HYPERV_PREP_COMMAND, this.prepare.bind(this));
    this.refreshContext().catch((error: unknown) => {
      this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error });
      console.warn('Unable to check Hyper-V prep status', error);
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
    return version !== null && compare(version, HyperVPrep.podmanMinimumVersionForHyperVPrep) >= 0;
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
  parseStatus(stdout: string): HyperVPrepStatusResult {
    const membership = this.extractStatusSection(stdout, HyperVPrep.MEMBERSHIP_HEADER);
    const isGroupMember = /^yes$/i.test(membership) || /current user is (?:a )?member/i.test(membership);

    return {
      status: isGroupMember ? 'applied' : 'notApplied',
    };
  }

  async run(): Promise<void> {
    await execPodman(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  }

  async refreshContext(): Promise<HyperVPrepStatusResult | undefined> {
    const supported = await this.isSupported();
    context.setValue(HYPERV_PREP_SUPPORTED_KEY, supported);

    if (!supported) {
      context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
      return undefined;
    }

    try {
      const status = await this.getStatus();
      context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, status.status === 'notApplied');
      return status;
    } catch (error) {
      this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error });
      console.warn('Unable to check Hyper-V prep status', error);
      context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, true);
      return undefined;
    }
  }

  /**
   * Extracts the text following a section header up to the next `Hyper-V` section.
   * For example, given `Hyper-V Administrators group membership:` as the header,
   * the sample status output in {@link parseStatus} yields the membership result.
   */
  private extractStatusSection(stdout: string, header: string): string {
    const start = stdout.toLowerCase().indexOf(header);
    if (start === -1) {
      return '';
    }

    const content = stdout.slice(start + header.length);
    const nextSection = content.search(/\nHyper-V /i);
    const section = (nextSection === -1 ? content : content.slice(0, nextSection)).trim();
    return section.split('\n')[0]?.trim() || section;
  }

  private async prepare(): Promise<void> {
    if (!(await this.isSupported())) {
      return;
    }

    try {
      const currentStatus = await this.getStatus();
      if (currentStatus.status === 'applied') {
        await window.showInformationMessage('Hyper-V preparation is already applied.');
        await this.refreshContext();
        return;
      }
    } catch (error) {
      const message = this.getErrorMessage(error, 'Unknown error while checking Hyper-V preparation status.');
      this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error: message });
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
      const message = this.getErrorMessage(error, 'Unknown error while preparing Hyper-V.');
      this.telemetryLogger.logError('hypervPrepFailed', { error: message });
      await window.showErrorMessage(`Hyper-V preparation failed: ${message}`);
      return;
    }

    const updatedStatus = await this.refreshContext();
    this.telemetryLogger.logUsage('podman.hypervPrep', { status: updatedStatus?.status ?? 'unknown' });
    if (updatedStatus?.status === 'applied') {
      await window.showInformationMessage(`Hyper-V preparation applied.\n\n${HyperVPrep.HYPERV_PREP_RELOGIN_MESSAGE}`);
    } else {
      await window.showInformationMessage(
        `Hyper-V preparation finished, but the status could not be confirmed.\n\n${HyperVPrep.HYPERV_PREP_RELOGIN_MESSAGE}`,
      );
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message || fallback;
    }

    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof error.message === 'string' && error.message.length > 0) {
        return error.message;
      }
      if ('stderr' in error && typeof error.stderr === 'string' && error.stderr.length > 0) {
        return error.stderr;
      }
      if ('stdout' in error && typeof error.stdout === 'string' && error.stdout.length > 0) {
        return error.stdout;
      }
    }

    return typeof error === 'string' && error.length > 0 ? error : fallback;
  }
}
