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

import type { RunError } from '@podman-desktop/api';
import { context, env } from '@podman-desktop/api';
import { compare } from 'semver';

import { HYPERV_PREP_NOT_APPLIED_KEY, HYPERV_PREP_SUPPORTED_KEY } from '/@/constants';
import type { PodmanBinary } from '/@/utils/podman-binary';
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

const MEMBERSHIP_HEADER = 'hyper-v administrators group membership:';
const REGISTRY_HEADER = 'hyper-v vsock registry entries:';

function extractHyperVPrepSection(stdout: string, header: string): string {
  const start = stdout.toLowerCase().indexOf(header);
  if (start === -1) {
    return '';
  }

  const content = stdout.slice(start + header.length);
  const nextSection = content.search(/\nHyper-V /i);
  const section = (nextSection === -1 ? content : content.slice(0, nextSection)).trim();
  return section.split('\n')[0]?.trim() || section;
}

function buildHyperVPrepMembershipSummary(isGroupMember: boolean): string {
  return isGroupMember
    ? 'You are a member of the Hyper-V Administrators group.'
    : 'You are not a member of the Hyper-V Administrators group.';
}

export function parseHyperVPrepStatus(stdout: string): Omit<HyperVPrepStatusResult, 'stdout'> {
  const membership = extractHyperVPrepSection(stdout, MEMBERSHIP_HEADER);
  const registry = extractHyperVPrepSection(stdout, REGISTRY_HEADER);
  const registrySource = registry || stdout;

  const isGroupMember = /^yes$/i.test(membership) || /current user is (?:a )?member/i.test(membership);

  const hasRegistryEntries =
    !/no vsock registry entries found/i.test(registrySource) &&
    /(?:guestcommunicationservices|vsock registry entries)[^\n]*:\s*[1-9]/i.test(registrySource);

  const status: HyperVPrepStatus = hasRegistryEntries || isGroupMember ? 'applied' : 'notApplied';

  return {
    status,
    isGroupMember,
    hasRegistryEntries,
    summary: buildHyperVPrepMembershipSummary(isGroupMember),
  };
}

export async function isHyperVPrepSupported(podmanBinary: PodmanBinary): Promise<boolean> {
  if (!env.isWindows) {
    return false;
  }

  const binaryInfo = await podmanBinary.getBinaryInfo();
  if (!binaryInfo) {
    return false;
  }

  return compare(binaryInfo.version, '6.0.0') >= 0;
}

function isHyperVPrepCommandMissing(error: unknown): boolean {
  const runError = error as RunError;
  const message = `${runError.message ?? ''} ${runError.stderr ?? ''} ${runError.stdout ?? ''}`.toLowerCase();
  return message.includes('unknown command') || message.includes('unrecognized') || message.includes('invalid');
}

export async function getHyperVPrepStatus(): Promise<HyperVPrepStatusResult> {
  const result = await execPodman(['system', 'hyperv-prep', '--status']);
  return {
    ...parseHyperVPrepStatus(result.stdout ?? ''),
    stdout: result.stdout,
  };
}

export async function runHyperVPrep(): Promise<void> {
  await execPodman(['system', 'hyperv-prep'], undefined, { isAdmin: true });
}

export async function refreshHyperVPrepContext(
  podmanBinary: PodmanBinary,
  telemetryLogger?: { logError: (event: string, properties?: Record<string, unknown>) => void },
): Promise<HyperVPrepStatusResult | undefined> {
  const supported = await isHyperVPrepSupported(podmanBinary);
  context.setValue(HYPERV_PREP_SUPPORTED_KEY, supported);

  if (!supported) {
    context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
    return undefined;
  }

  try {
    const details = await getHyperVPrepStatus();
    context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, details.status === 'notApplied');
    return details;
  } catch (error) {
    if (isHyperVPrepCommandMissing(error)) {
      context.setValue(HYPERV_PREP_SUPPORTED_KEY, false);
      context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, false);
      return undefined;
    }

    telemetryLogger?.logError('hypervPrepStatusCheckFailed', { error });
    console.warn('Unable to check Hyper-V prep status', error);
    context.setValue(HYPERV_PREP_NOT_APPLIED_KEY, true);
    return undefined;
  }
}
