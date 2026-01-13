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

/**
 * Target returned by extension providers for certificate synchronization.
 * Extensions should only return targets that support synchronization.
 */
export interface CertificateSyncTarget {
  /** Unique identifier for the target within the provider */
  id: string;
  /** Display name for the target */
  name: string;
}

/**
 * Provider interface for extensions that contribute certificate sync targets.
 */
export interface CertificateSyncTargetProvider {
  /**
   * Get all available sync targets from this provider.
   * @returns A promise that resolves to an array of sync targets.
   */
  getTargets(): Promise<CertificateSyncTarget[]>;

  /**
   * Synchronize certificates to a specific target.
   * @param targetId The ID of the target to synchronize to.
   * @param certificates Array of PEM-encoded certificates to synchronize.
   */
  synchronize(targetId: string, certificates: string[]): Promise<void>;
}

/**
 * Extended target with extension info for UI display.
 * Returned by the registry (only includes trusted extensions).
 */
export interface CertificateSyncTargetInfo extends CertificateSyncTarget {
  /** ID of the provider that contributed this target */
  providerId: string;
  /** ID of the extension that registered the provider */
  extensionId: string;
  /** Display name of the extension */
  extensionName: string;
}
