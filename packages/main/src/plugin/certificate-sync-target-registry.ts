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
import type { CertificateSyncTargetInfo } from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { inject, injectable } from 'inversify';

import { IPCHandle } from './api.js';
import { Certificates } from './certificates.js';
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
  provider: containerDesktopAPI.CertificateSyncTargetProvider;
}

/**
 * Internal target info with composite ID for unique lookup.
 * The `id` field keeps the original target ID from the provider.
 * The `compositeId` is used as the map key and returned to UI for unique identification.
 */
interface InternalCertificateSyncTargetInfo extends CertificateSyncTargetInfo {
  /** Composite key: extensionId:targetId */
  compositeId: string;
}

/**
 * Registry for certificate sync target providers.
 *
 * Implements a trust model where only preinstalled extensions (bundled with
 * Podman Desktop) can register synchronization targets. User-installed
 * extensions will have their targets not shown in the UI for security reasons.
 */
@injectable()
export class CertificateSyncTargetRegistry {
  private providers: Map<string, RegisteredProvider> = new Map();
  // Flat map with composite keys: extensionId:targetId -> target
  private targetsCache: Map<string, InternalCertificateSyncTargetInfo> = new Map();

  private readonly _onDidChangeTargets = new Emitter<containerDesktopAPI.CertificateSyncTargetProviderChangeEvent>();
  readonly onDidChangeTargets: containerDesktopAPI.Event<containerDesktopAPI.CertificateSyncTargetProviderChangeEvent> =
    this._onDidChangeTargets.event;

  constructor(
    @inject(Certificates)
    private certificates: Certificates,
    @inject(IPCHandle)
    private readonly ipcHandle: IPCHandle,
    @inject(ApiSenderType)
    private readonly apiSender: ApiSenderType,
  ) {}

  init(): void {
    this.ipcHandle('certificates:getSyncTargets', async (): Promise<CertificateSyncTargetInfo[]> => {
      return this.getTargets();
    });

    this.ipcHandle(
      'certificates:synchronizeToTargets',
      async (_listener, targetIds: string[]): Promise<{ errors: { targetId: string; error: string }[] }> => {
        return this.synchronizeToTargets(targetIds);
      },
    );

    this.onDidChangeTargets(() => {
      this.apiSender.send('certificate-sync-targets-update');
    });
  }

  /**
   * Build a composite key for a target.
   */
  private buildTargetKey(extensionId: string, targetId: string): string {
    return `${extensionId}:${targetId}`;
  }

  /**
   * Clear all cached targets for a specific extension.
   */
  private clearProviderTargets(extensionId: string): void {
    for (const [key, target] of this.targetsCache) {
      if (target.extensionId === extensionId) {
        this.targetsCache.delete(key);
      }
    }
  }

  /**
   * Update the cached targets for the provider registered by the given extension.
   * Only caches targets from trusted (preinstalled) extensions.
   */
  private async updateProviderTargets(extensionId: string, registered: RegisteredProvider): Promise<void> {
    const { extensionInfo } = registered;

    // Clear existing targets for this extension
    this.clearProviderTargets(extensionId);

    // Skip untrusted (user-installed) extensions
    if (extensionInfo.removable) {
      return;
    }

    try {
      const targets = await registered.provider.getTargets();

      // Guard: if disposed during the await, the provider map entry will be
      // gone or replaced by a new instance — discard the stale results.
      if (this.providers.get(extensionId) !== registered) {
        return;
      }

      for (const target of targets) {
        const compositeId = this.buildTargetKey(extensionId, target.id);
        this.targetsCache.set(compositeId, {
          ...target,
          compositeId,
          extensionId,
          extensionName: extensionInfo.name,
        });
      }
    } catch (error) {
      console.error(`Error getting targets from provider (${extensionId}):`, error);
    }
  }

  /**
   * Register a certificate sync target provider.
   *
   * Each extension can register at most one provider. Attempting to register a
   * second provider from the same extension will throw an error.
   *
   * @param extensionInfo Information about the extension registering the provider.
   * @param provider The provider implementation.
   * @returns A disposable that unregisters the provider when disposed.
   */
  registerProvider(
    extensionInfo: CertificateSyncExtensionInfo,
    provider: containerDesktopAPI.CertificateSyncTargetProvider,
  ): Disposable {
    const extensionId = extensionInfo.id;

    if (this.providers.has(extensionId)) {
      throw new Error(`Extension '${extensionId}' has already registered a certificate sync target provider`);
    }

    const registered: RegisteredProvider = {
      extensionInfo,
      provider,
    };

    this.providers.set(extensionId, registered);

    const providerInfo: containerDesktopAPI.CertificateSyncTargetProviderInformation = {
      extensionId,
      label: extensionInfo.name,
    };

    // Fetch targets and notify listeners
    const refreshTargets = (): void => {
      this.updateProviderTargets(extensionId, registered)
        .catch((err: unknown) => {
          console.error(`Error updating targets for provider (${extensionId}):`, err);
        })
        .finally(() => {
          this._onDidChangeTargets.fire({ provider: providerInfo });
        });
    };

    // Subscribe to provider's onDidChangeTargets event
    const providerEventSubscription = provider.onDidChangeTargets(refreshTargets);

    // Initial fetch of targets
    refreshTargets();

    return Disposable.create((): void => {
      // Unsubscribe from provider event
      providerEventSubscription.dispose();
      this.providers.delete(extensionId);
      // Clear cached targets for this extension
      this.clearProviderTargets(extensionId);
      // Notify listeners that targets have changed
      this._onDidChangeTargets.fire({ provider: providerInfo });
    });
  }

  /**
   * Get all sync targets from trusted (preinstalled) providers only.
   *
   * Returns cached targets that are updated when providers fire onDidChangeTargets.
   * Target IDs returned to UI are composite keys (extensionId:targetId) to ensure uniqueness.
   *
   * Applies the trust model:
   * - Preinstalled extensions (removable === false): targets are included
   * - User-installed extensions (removable === true): targets are excluded
   *
   * @returns An array of sync targets with extension info, using compositeId as id.
   */
  getTargets(): CertificateSyncTargetInfo[] {
    // Return targets with compositeId as the id for UI usage
    return Array.from(this.targetsCache.values()).map(target => ({
      ...target,
      id: target.compositeId,
    }));
  }

  /**
   * Synchronize certificates to a specific target.
   * O(1) lookup using the composite target ID.
   *
   * @param compositeId The composite target ID (extensionId:originalTargetId).
   * @throws Error if the target is not found.
   */
  async synchronize(compositeId: string): Promise<void> {
    const target = this.targetsCache.get(compositeId);
    if (!target) {
      throw new Error(`Target '${compositeId}' not found`);
    }

    const registered = this.providers.get(target.extensionId);
    if (!registered) {
      throw new Error(`Provider for target '${compositeId}' not found`);
    }

    const certificatePems = this.certificates.getAllCertificates();
    await registered.provider.synchronize(target.id, certificatePems);
  }

  /**
   * Synchronize certificates to multiple targets in parallel.
   *
   * Each target runs independently - errors in one target don't affect others.
   *
   * @param targetIds Array of composite target IDs to synchronize to.
   * @returns Object containing an array of errors for failed targets.
   */
  async synchronizeToTargets(targetIds: string[]): Promise<{ errors: { targetId: string; error: string }[] }> {
    // Run all targets in parallel - each target has its own cancellation handling
    const results = await Promise.allSettled(targetIds.map(id => this.synchronize(id)));

    // Collect errors from failed targets
    const errors: { targetId: string; error: string }[] = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const targetId = targetIds[index];
        if (targetId) {
          errors.push({
            targetId,
            error: result.reason instanceof Error ? result.reason.message : String(result.reason),
          });
        }
      }
    });

    return { errors };
  }
}
