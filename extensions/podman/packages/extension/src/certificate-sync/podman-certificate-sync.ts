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

import * as crypto from 'node:crypto';

import type { CertificateSyncTarget, CertificateSyncTargetProvider, Progress } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';

import type { MachineJSON, MachineJSONListOutput } from '../types';
import { execPodman } from '../utils/util';

/**
 * Function type for getting the list of Podman machines.
 */
export type GetMachineListFn = () => Promise<MachineJSONListOutput>;

/**
 * Podman Certificate Sync Provider
 *
 * Provides certificate synchronization targets for Podman machines (local VMs on macOS/Windows).
 * Uploads certificates to /etc/pki/ca-trust/source/anchors/ and updates the trust store.
 */
export class PodmanCertificateSync implements CertificateSyncTargetProvider {
  constructor(private readonly getMachineList: GetMachineListFn) {}

  /**
   * Get available Podman machines that support certificate synchronization.
   * Only returns running VM-based machines (macOS/Windows).
   */
  async getTargets(): Promise<CertificateSyncTarget[]> {
    const targets: CertificateSyncTarget[] = [];

    try {
      const machineListOutput = await this.getMachineList();
      const machines = machineListOutput.list;

      for (const machine of machines) {
        // Only include running VM-based machines
        if (this.supportsSynchronization(machine)) {
          targets.push({
            id: machine.Name,
            name: machine.Name,
          });
        }
      }
    } catch (error) {
      console.error('Failed to get Podman machines for certificate sync:', error);
    }

    return targets;
  }

  /**
   * Check if a machine supports certificate synchronization.
   * Must be running and VM-based (has VMType).
   */
  private supportsSynchronization(machine: MachineJSON): boolean {
    // Must be running
    if (!machine.Running) {
      return false;
    }

    // Must have VMType (local VM on macOS/Windows)
    // Native Linux Podman has no VMType and certificates are already available
    return !!machine.VMType;
  }

  /**
   * Synchronize certificates to a specific Podman machine target.
   */
  async synchronize(targetId: string, certificates: string[]): Promise<void> {
    const machineName = targetId;
    const totalCerts = certificates.length;

    if (totalCerts === 0) {
      return;
    }

    await extensionApi.window.withProgress(
      {
        location: extensionApi.ProgressLocation.TASK_WIDGET,
        title: `Synchronizing certificates to ${machineName}`,
      },
      async (progress: Progress<{ message?: string; increment?: number }>) => {
        await this.doSynchronize(machineName, certificates, progress);
      },
    );
  }

  /**
   * Perform the actual certificate synchronization with progress reporting.
   * Note: progress.report({ increment }) SETS the progress value, doesn't add to it.
   */
  private async doSynchronize(
    machineName: string,
    certificates: string[],
    progress: Progress<{ message?: string; increment?: number }>,
  ): Promise<void> {
    const totalCerts = certificates.length;
    const anchorsPath = '/etc/pki/ca-trust/source/anchors';
    let currentPercent = 0;

    try {
      // Ensure the anchors directory exists (0% -> 5%)
      currentPercent = 5;
      progress.report({ message: `Creating anchors directory on ${machineName}`, increment: currentPercent });
      await this.runMachineCommand(machineName, `sudo mkdir -p ${anchorsPath}`);

      // Upload each certificate (5% -> 85%)
      for (let i = 0; i < certificates.length; i++) {
        const pem = certificates[i];
        if (!pem) continue;

        const fingerprint = this.getCertificateFingerprint(pem);
        const filename = `podman-desktop-${fingerprint}.crt`;
        const remotePath = `${anchorsPath}/${filename}`;

        // Update progress at the START of each certificate upload
        currentPercent = 5 + Math.floor(((i + 1) / totalCerts) * 80);
        progress.report({
          message: `(${i + 1}/${totalCerts}) Uploading certificate to ${machineName}`,
          increment: currentPercent,
        });

        // Write certificate to VM using base64 encoding to handle special characters
        const base64Cert = Buffer.from(pem).toString('base64');
        try {
          await this.runMachineCommand(
            machineName,
            `echo '${base64Cert}' | base64 -d | sudo tee ${remotePath} > /dev/null`,
          );
        } catch (error) {
          console.error(`Failed to upload certificate ${filename}:`, error);
          // Continue with other certificates
        }
      }

      // Update the CA trust store (85% -> 95%)
      progress.report({ message: `Updating CA trust store on ${machineName}`, increment: 90 });
      await this.runMachineCommand(machineName, 'sudo update-ca-trust');

      // Restart podman services to pick up new certificates (95% -> 100%)
      progress.report({ message: `Restarting Podman services on ${machineName}`, increment: 95 });
      await this.runMachineCommand(machineName, 'sudo systemctl restart podman.socket podman.service');

      progress.report({ message: `Synchronized ${totalCerts} certificates to ${machineName}`, increment: 100 });
    } finally {
      progress.report({ increment: -1 });
    }
  }

  /**
   * Run a command on a Podman machine via SSH.
   * If the command fails, execPodman will throw a RunError.
   */
  private async runMachineCommand(machineName: string, command: string): Promise<void> {
    await execPodman(['machine', 'ssh', machineName, command]);
  }

  /**
   * Generate a unique fingerprint for a certificate based on its SHA-256 hash.
   */
  private getCertificateFingerprint(pem: string): string {
    const hash = crypto.createHash('sha256').update(pem).digest('hex');
    return hash.substring(0, 16); // Use first 16 chars for reasonable uniqueness
  }
}
