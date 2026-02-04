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

import type * as containerDesktopAPI from '@podman-desktop/api';
import { injectable } from 'inversify';

import type { CertificateSyncTargetInfo } from '/@api/certificate-sync-target.js';

import { Emitter } from './events/emitter.js';
import { Disposable } from './types/disposable.js';

/**
 * Minimal extension info needed for the certificate sync registry.
 */
export interface CertificateSyncExtensionInfo {
  id: string;
  name: string;
  removable: boolean;
}

/**
 * Internal representation of a registered provider with extension metadata.
 */
interface RegisteredProvider {
  extensionInfo: CertificateSyncExtensionInfo;
  providerId: string;
  provider: containerDesktopAPI.CertificateSyncTargetProvider;
}

/**
 * Registry for certificate sync target providers.
 *
 * Implements a trust model where only preinstalled extensions (bundled with
 * Podman Desktop) can register sychronization targets. User-installed
 * extensions will have their targets not shown in the UI for security reasons.
 */
@injectable()
export class CertificateSyncTargetRegistry {
  private providers: Map<string, RegisteredProvider> = new Map();

  private readonly _onDidChangeSyncTargets = new Emitter<void>();
  readonly onDidChangeSyncTargets: containerDesktopAPI.Event<void> = this._onDidChangeSyncTargets.event;

  /**
   * Register a certificate sync target provider.
   *
   * @param extensionInfo Information about the extension registering the provider.
   * @param providerId Unique identifier for the provider.
   * @param provider The provider implementation.
   * @returns A disposable that unregisters the provider when disposed.
   */
  registerProvider(
    extensionInfo: CertificateSyncExtensionInfo,
    providerId: string,
    provider: containerDesktopAPI.CertificateSyncTargetProvider,
  ): Disposable {
    const key = `${extensionInfo.id}:${providerId}`;

    if (this.providers.has(key)) {
      throw new Error(`Certificate sync target provider '${providerId}' is already registered by ${extensionInfo.id}`);
    }

    this.providers.set(key, {
      extensionInfo,
      providerId,
      provider,
    });

    // Notify listeners that targets have changed
    this._onDidChangeSyncTargets.fire();

    return Disposable.create((): void => {
      this.providers.delete(key);
      // Notify listeners that targets have changed
      this._onDidChangeSyncTargets.fire();
    });
  }

  /**
   * Get all sync targets from trusted (preinstalled) providers only.
   *
   * Applies the trust model:
   * - Preinstalled extensions (removable === false): targets are included
   * - User-installed extensions (removable === true): targets are excluded
   *
   * Extensions only return targets that support synchronization.
   *
   * @returns A promise that resolves to an array of sync targets with extension info.
   */
  async getTargets(): Promise<CertificateSyncTargetInfo[]> {
    const allTargets: CertificateSyncTargetInfo[] = [];

    for (const registered of this.providers.values()) {
      // Skip untrusted (user-installed) extensions
      const isTrusted = registered.extensionInfo.removable === false;
      if (!isTrusted) {
        continue;
      }

      try {
        const targets = await registered.provider.getTargets();

        for (const target of targets) {
          allTargets.push({
            ...target,
            providerId: registered.providerId,
            extensionId: registered.extensionInfo.id,
            extensionName: registered.extensionInfo.name,
          });
        }
      } catch (error) {
        console.error(
          `Error getting targets from provider '${registered.providerId}' (${registered.extensionInfo.id}):`,
          error,
        );
      }
    }

    return allTargets;
  }

  /**
   * Synchronize certificates to a specific target.
   * Searches trusted providers only to find the target by ID.
   *
   * Applies the same trust model as getTargets():
   * - Preinstalled extensions (removable === false): allowed
   * - User-installed extensions (removable === true): rejected
   *
   * @param targetId The ID of the target.
   * @param certificates Array of PEM-encoded certificates to synchronize.
   * @throws Error if the target is not found in any trusted provider.
   */
  async synchronize(targetId: string, certificates: string[]): Promise<void> {
    // Search trusted providers only for the target
    for (const registeredProvider of this.providers.values()) {
      // Skip untrusted (user-installed) extensions
      const isTrusted = registeredProvider.extensionInfo.removable === false;
      if (!isTrusted) {
        continue;
      }

      const targets = await registeredProvider.provider.getTargets();
      const target = targets.find(t => t.id === targetId);

      if (target) {
        // Found the target, perform synchronization
        await registeredProvider.provider.synchronize(targetId, certificates);
        return;
      }
    }

    throw new Error(`Target '${targetId}' not found in any trusted provider`);
  }
}
