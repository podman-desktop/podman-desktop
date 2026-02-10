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
import { inject, injectable } from 'inversify';

import type { CertificateSyncTargetInfo } from '/@api/certificate-sync-target.js';

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
  providerId: string;
  provider: containerDesktopAPI.CertificateSyncTargetProvider;
}

/**
 * Internal target info with composite ID for unique lookup.
 * The `id` field keeps the original target ID from the provider.
 * The `compositeId` is used as the map key and returned to UI for unique identification.
 */
interface InternalCertificateSyncTargetInfo extends CertificateSyncTargetInfo {
  /** Composite key: extensionId:providerId:targetId */
  compositeId: string;
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
  // Flat map with composite keys: extensionId:providerId:targetId -> target
  private targetsCache: Map<string, InternalCertificateSyncTargetInfo> = new Map();

  private readonly _onDidChangeTargets = new Emitter<containerDesktopAPI.CertificateSyncTargetProviderChangeEvent>();
  readonly onDidChangeTargets: containerDesktopAPI.Event<containerDesktopAPI.CertificateSyncTargetProviderChangeEvent> =
    this._onDidChangeTargets.event;

  constructor(
    @inject(Certificates)
    private certificates: Certificates,
  ) {}

  /**
   * Build a composite key for a target.
   */
  private buildTargetKey(extensionId: string, providerId: string, targetId: string): string {
    return `${extensionId}:${providerId}:${targetId}`;
  }

  /**
   * Clear all cached targets for a specific provider.
   */
  private clearProviderTargets(extensionId: string, providerId: string): void {
    const prefix = `${extensionId}:${providerId}:`;
    for (const key of this.targetsCache.keys()) {
      if (key.startsWith(prefix)) {
        this.targetsCache.delete(key);
      }
    }
  }

  /**
   * Update the cached targets for a specific provider.
   * Only caches targets from trusted (preinstalled) extensions.
   */
  private async updateProviderTargets(_key: string, registered: RegisteredProvider): Promise<void> {
    const { extensionInfo, providerId } = registered;

    // Clear existing targets for this provider
    this.clearProviderTargets(extensionInfo.id, providerId);

    // Skip untrusted (user-installed) extensions
    if (extensionInfo.removable) {
      return;
    }

    try {
      const targets = await registered.provider.getTargets();
      for (const target of targets) {
        const compositeId = this.buildTargetKey(extensionInfo.id, providerId, target.id);
        this.targetsCache.set(compositeId, {
          ...target,
          compositeId,
          providerId,
          extensionId: extensionInfo.id,
          extensionName: extensionInfo.name,
        });
      }
    } catch (error) {
      console.error(`Error getting targets from provider '${providerId}' (${extensionInfo.id}):`, error);
    }
  }

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

    const registered: RegisteredProvider = {
      extensionInfo,
      providerId,
      provider,
    };

    this.providers.set(key, registered);

    const providerInfo: containerDesktopAPI.CertificateSyncTargetProviderInformation = {
      id: providerId,
      label: extensionInfo.name,
    };

    // Fetch targets and notify listeners
    const refreshTargets = (): void => {
      this.updateProviderTargets(key, registered)
        .catch((err: unknown) => {
          console.error(`Error updating targets for provider '${providerId}':`, err);
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
      this.providers.delete(key);
      // Clear cached targets for this provider
      this.clearProviderTargets(extensionInfo.id, providerId);
      // Notify listeners that targets have changed
      this._onDidChangeTargets.fire({ provider: providerInfo });
    });
  }

  /**
   * Get all sync targets from trusted (preinstalled) providers only.
   *
   * Returns cached targets that are updated when providers fire onDidChangeTargets.
   * Target IDs returned to UI are composite keys (extensionId:providerId:targetId) to ensure uniqueness.
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
   * @param compositeId The composite target ID (extensionId:providerId:originalTargetId).
   * @throws Error if the target is not found.
   */
  async synchronize(compositeId: string): Promise<void> {
    const target = this.targetsCache.get(compositeId);
    if (!target) {
      throw new Error(`Target '${compositeId}' not found`);
    }

    const providerKey = `${target.extensionId}:${target.providerId}`;
    const registered = this.providers.get(providerKey);
    if (!registered) {
      throw new Error(`Provider for target '${compositeId}' not found`);
    }

    const certificatePems = this.certificates.getAllCertificates();
    // Use original target id stored in the target
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
