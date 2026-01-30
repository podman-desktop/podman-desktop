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

import type { ImageUpdateStatus } from '/@api/image-registry';

export interface UpdateStatusStyle {
  dotColor: string;
  label: string;
}

/**
 * Get display style for update availability status
 */
export function getUpdateAvailableStyle(status?: ImageUpdateStatus): UpdateStatusStyle {
  if (!status) {
    return {
      dotColor: 'bg-[var(--pd-status-paused)]',
      label: 'Checking',
    };
  }
  if (status.status === 'error') {
    return {
      dotColor: 'bg-[var(--pd-status-terminated)]',
      label: 'Error',
    };
  }
  if (status.updateAvailable) {
    return {
      dotColor: 'bg-[var(--pd-status-connected)]',
      label: 'Available',
    };
  }
  // Check if the image cannot be checked (local, dangling, or immutable)
  if (status.status === 'skipped') {
    return {
      dotColor: 'bg-[var(--pd-status-stopped)]',
      label: 'N/A',
    };
  }
  return {
    dotColor: 'bg-[var(--pd-status-stopped)]',
    label: 'Up to date',
  };
}

export interface ResultStatusStyle {
  dotColor: string;
  label: string;
}

/**
 * Get display style for update result
 */
export function getResultStyle(updating: boolean, updated: boolean, error?: string): ResultStatusStyle | undefined {
  if (updating) {
    return {
      dotColor: 'bg-[var(--pd-status-starting)]',
      label: 'Updating',
    };
  }
  if (updated) {
    return {
      dotColor: 'bg-[var(--pd-status-connected)]',
      label: 'Updated',
    };
  }
  if (error) {
    return {
      dotColor: 'bg-[var(--pd-status-terminated)]',
      label: 'Failed',
    };
  }
  return undefined;
}

/**
 * Format image display name, truncating if needed
 */
export function formatImageDisplayName(name: string, tag: string, maxLength = 50): string {
  const isDigest = tag.startsWith('sha256:') || tag.startsWith('sha384:') || tag.startsWith('sha512:');
  const displayTag = isDigest ? '' : `:${tag}`;
  const fullDisplay = `${name}${displayTag}`;
  return fullDisplay.length > maxLength ? fullDisplay.slice(0, maxLength - 3) + '...' : fullDisplay;
}

/**
 * Get full image reference
 */
export function getFullImageRef(name: string, tag: string): string {
  return `${name}:${tag}`;
}
