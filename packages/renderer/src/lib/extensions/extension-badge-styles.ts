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

export const EXTENSION_CHIP_BADGE_CLASS = 'shrink-0 cursor-pointer m-0';

export const EXTENSION_BUILTIN_CHIP_LABEL = 'Built-in extension';

export const EXTENSION_BUILTIN_CHIP_TOOLTIP = 'Pre-installed with Podman Desktop';

export const EXTENSION_BUILTIN_INDICATOR_TOOLTIP = 'Built-in extension';

/** Blue indicator icons shown next to extension names (featured, built-in). */
export const EXTENSION_INDICATOR_ICON_CLASS = 'text-sm text-[var(--pd-badge-sky)]';

/** Verified publisher indicator uses link color to match existing chrome. */
export const EXTENSION_VERIFIED_INDICATOR_ICON_CLASS = 'text-sm text-[var(--pd-link)]';

export const EXTENSION_NEW_BADGE_TOOLTIP = 'Just installed';

export function buildExtensionNewNavigationTooltip(name: string): string {
  return `Open ${name} from the sidebar to get started.`;
}

export const EXTENSION_INSTALL_TOOLTIP = 'Install';

export function buildExtensionInstallingTooltip(percentage?: string): string {
  if (percentage && percentage !== '0%') {
    return `Installing (${percentage})`;
  }
  return 'Installing';
}

export const EXTENSION_CHIP_COLORS = {
  featured: 'bg-[var(--pd-badge-sky)]',
  new: 'bg-yellow-500',
  update: 'bg-[var(--pd-status-warning)]',
  installed: 'bg-[var(--pd-badge-gray)]',
  category: 'bg-[var(--pd-status-disconnected)]',
  community: 'bg-[var(--pd-status-disconnected)]',
  verified: 'bg-[var(--pd-status-running)]',
  communityOrigin: 'bg-[var(--pd-status-disconnected)]',
  /** Dark gray background for readable white label text. */
  builtin: 'bg-[var(--pd-status-disconnected)]',
  devMode: 'bg-[var(--pd-status-disconnected)]',
  dockerDesktop: 'bg-[var(--pd-badge-dd-extension-bg)]',
  dockerDesktopText: '!text-white',
} as const;

export const EXTENSION_CHIP_TEXT_CLASS = '!text-white';

/** @deprecated Use EXTENSION_CHIP_TEXT_CLASS for gray-background chips. */
export const EXTENSION_BUILTIN_CHIP_TEXT_CLASS = EXTENSION_CHIP_TEXT_CLASS;

export function buildExtensionBugReportUrl(repositoryUrl?: string): string {
  const fallback = 'https://github.com/podman-desktop/podman-desktop/issues/new';
  if (!repositoryUrl) {
    return fallback;
  }
  if (repositoryUrl.includes('/issues/new')) {
    return repositoryUrl;
  }
  const githubRepoPattern = /^https:\/\/github\.com\/([^/]+\/[^/]+)/;
  const match = githubRepoPattern.exec(repositoryUrl);
  if (match) {
    return `https://github.com/${match[1]}/issues/new`;
  }
  return fallback;
}
