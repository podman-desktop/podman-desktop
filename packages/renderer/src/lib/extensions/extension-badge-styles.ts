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

export const EXTENSION_CHIP_BADGE_CLASS = 'shrink-0 !me-0';

export const EXTENSION_CHIP_COLORS = {
  featured: 'bg-[var(--pd-badge-purple)]',
  new: 'bg-[var(--pd-badge-purple)]',
  update: 'bg-[var(--pd-status-warning)]',
  installed: 'bg-[var(--pd-invert-content-info-icon)]',
  community: 'bg-[var(--pd-badge-sky)]',
  verified: 'bg-[var(--pd-status-running)]',
  communityOrigin: 'bg-[var(--pd-badge-sky)]',
  builtin: 'bg-[var(--pd-badge-purple)]',
  devMode: 'bg-[var(--pd-badge-devmode-extension-bg)]',
  dockerDesktop: 'bg-[var(--pd-badge-dd-extension-bg)]',
  dockerDesktopText: 'text-[var(--pd-badge-dd-extension-text)]',
} as const;

export const EXTENSION_CHIP_TEXT_CLASS = '!text-white';

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
