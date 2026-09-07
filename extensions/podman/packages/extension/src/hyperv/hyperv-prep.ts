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

import type { Disposable, RunError, TelemetryLogger } from '@podman-desktop/api';
import { commands, context, env, ProgressLocation, window } from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { compare } from 'semver';

import { HYPERV_PREP_COMMAND, HYPERV_PREP_NOT_APPLIED_KEY, HYPERV_PREP_SUPPORTED_KEY } from '/@/constants';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { PodmanBinary } from '/@/utils/podman-binary';
import { execPodman } from '/@/utils/util';

export type HyperVPrepStatus = 'notApplied' | 'applied';

export const HYPERV_PREP_RELOGIN_MESSAGE =
  'Sign out of Windows and sign back in (or restart your computer) for Hyper-V Administrators group membership to take effect.';

export interface HyperVPrepStatusResult {
  status: HyperVPrepStatus;
  isGroupMember: boolean;
  hasRegistryEntries: boolean;
  summary: string;
  stdout?: string;
}

const PODMAN_MINIMUM_VERSION_FOR_HYPERV_PREP = '6.0.0';
const MEMBERSHIP_HEADER = 'hyper-v administrators group membership:';
const REGISTRY_HEADER = 'hyper-v vsock registry entries:';

@injectable()
export class HyperVPrep {
  #command: Disposable | undefined;

  constructor(
    @inject(PodmanBinary)
    private readonly podmanBinary: PodmanBinary,
    @inject(TelemetryLoggerSymbol)
    private readonly telemetryLogger: TelemetryLogger,
  ) {}

  @postConstruct()
  async init(): Promise<void> {
    if (!env.isWindows) {
      return;
    }

    await this.refreshContext();
    this.#command = commands.registerCommand(HYPERV_PREP_COMMAND, this.prepare.bind(this));
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
    return binaryInfo !== undefined && compare(binaryInfo.version, PODMAN_MINIMUM_VERSION_FOR_HYPERV_PREP) >= 0;
  }

  async getStatus(): Promise<HyperVPrepStatusResult> {
    const result = await execPodman(['system', 'hyperv-prep', '--status']);
    return {
      ...this.parseStatus(result.stdout ?? ''),
      stdout: result.stdout,
    };
  }

  parseStatus(stdout: string): Omit<HyperVPrepStatusResult, 'stdout'> {
    const membership = this.extractStatusSection(stdout, MEMBERSHIP_HEADER);
    const registry = this.extractStatusSection(stdout, REGISTRY_HEADER);
    const registrySource = registry || stdout;

    const isGroupMember = /^yes$/i.test(membership) || /current user is (?:a )?member/i.test(membership);
    const hasRegistryEntries =
      !/no vsock registry entries found/i.test(registrySource) &&
      /(?:guestcommunicationservices|vsock registry entries)[^\n]*:\s*[1-9]/i.test(registrySource);
    const status = hasRegistryEntries || isGroupMember ? 'applied' : 'notApplied';

    return {
      status,
      isGroupMember,
      hasRegistryEntries,
      summary: this.buildMembershipSummary(isGroupMember),
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
      if (this.isCommandMissing(error)) {
        context.setValue(HYPERV_PREP_SUPPORTED_KEY, false);
        context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
        return undefined;
      }

      this.telemetryLogger.logError('hypervPrepStatusCheckFailed', { error });
      console.warn('Unable to check Hyper-V prep status', error);
      context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, true);
      return undefined;
    }
  }

  private isCommandMissing(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const runError = error as RunError;
    const message = `${runError.message ?? ''} ${runError.stderr ?? ''} ${runError.stdout ?? ''}`.toLowerCase();
    return message.includes('unknown command') || message.includes('unrecognized') || message.includes('invalid');
  }

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

  private buildMembershipSummary(isGroupMember: boolean): string {
    return isGroupMember
      ? 'You are a member of the Hyper-V Administrators group.'
      : 'You are not a member of the Hyper-V Administrators group.';
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
      await window.showInformationMessage(`Hyper-V preparation applied.\n\n${HYPERV_PREP_RELOGIN_MESSAGE}`);
    } else {
      await window.showInformationMessage(
        `Hyper-V preparation finished, but the status could not be confirmed.\n\n${HYPERV_PREP_RELOGIN_MESSAGE}`,
      );
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message || fallback;
    }

    if (typeof error === 'object' && error !== null) {
      const runError = error as RunError;
      return runError.message || runError.stderr || runError.stdout || fallback;
    }

    return typeof error === 'string' && error.length > 0 ? error : fallback;
  }
}
