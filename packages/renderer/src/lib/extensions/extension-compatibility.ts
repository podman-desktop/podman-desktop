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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import type { ExtensionDetailsWarning } from './extension-details-warning';
import { arePrototypeUseCasesEnabled, USE_CASE_EXTENSION_IDS } from './extension-prototype-use-cases';
import { normalizeVersionValue } from './extension-version-update.svelte';

export type ExtensionCompatibilityIssueType = 'incompatible-version' | 'missing-dependency';

export interface ExtensionCompatibilityIssue {
  type: ExtensionCompatibilityIssueType;
  title: string;
  detail: string;
  fix: string;
}

export interface ExtensionDependencyRequirement {
  id: string;
  displayName: string;
  required: boolean;
}

export interface ExtensionCompatibilityRequirements {
  minPodmanDesktopVersion?: string;
  dependencies?: ExtensionDependencyRequirement[];
}

let prototypeCompatibilityWarningsEnabled = true;

export function setPrototypeCompatibilityWarningsEnabled(enabled: boolean): void {
  prototypeCompatibilityWarningsEnabled = enabled;
}

export function arePrototypeCompatibilityWarningsEnabled(): boolean {
  return prototypeCompatibilityWarningsEnabled;
}

function compareVersions(left: string, right: string): number {
  return normalizeVersionValue(left).localeCompare(normalizeVersionValue(right), undefined, { numeric: true });
}

function isVersionAtLeast(current: string, minimum: string): boolean {
  return compareVersions(current, minimum) >= 0;
}

/**
 * Prototype-only compatibility metadata on real extensions (DTUX-2849).
 */
export function getPrototypeCompatibilityRequirements(
  extensionId: string,
): ExtensionCompatibilityRequirements | undefined {
  if (!prototypeCompatibilityWarningsEnabled || !arePrototypeUseCasesEnabled()) {
    return undefined;
  }

  if (extensionId === USE_CASE_EXTENSION_IDS.incompatibleVersion) {
    return { minPodmanDesktopVersion: '99.0.0' };
  }

  if (extensionId === USE_CASE_EXTENSION_IDS.missingDependency) {
    return {
      dependencies: [{ id: 'podman-desktop.minikube', displayName: 'minikube', required: true }],
    };
  }

  return undefined;
}

/** Prototype demo: Kind always shows missing minikube for design review (DTUX-2849). */
function shouldReportMissingDependency(extensionId: string, dependencyId: string, installedIds: Set<string>): boolean {
  if (
    prototypeCompatibilityWarningsEnabled &&
    arePrototypeUseCasesEnabled() &&
    extensionId === USE_CASE_EXTENSION_IDS.missingDependency
  ) {
    return true;
  }
  return !installedIds.has(dependencyId);
}

export function formatExtensionCompatibilityIssueTooltip(issue: ExtensionCompatibilityIssue): string {
  return `${issue.title}: ${issue.detail} ${issue.fix}`;
}

export function mapCompatibilityIssuesToDetailsWarnings(
  issues: ExtensionCompatibilityIssue[],
): ExtensionDetailsWarning[] {
  return issues.map(issue => ({
    key: issue.type,
    severity: 'warning',
    title: issue.title,
    detail: issue.detail,
    fix: issue.fix,
  }));
}

export function resolveExtensionCompatibilityIssues(
  extension: Pick<CatalogExtensionInfoUI, 'id' | 'displayName' | 'isInstalled'>,
  installedExtensions: CombinedExtensionInfoUI[],
  podmanDesktopVersion?: string,
): ExtensionCompatibilityIssue[] {
  const requirements = getPrototypeCompatibilityRequirements(extension.id);
  if (!requirements) {
    return [];
  }

  const issues: ExtensionCompatibilityIssue[] = [];

  if (requirements.minPodmanDesktopVersion) {
    const currentVersion = podmanDesktopVersion ?? '0.0.0';
    if (!isVersionAtLeast(currentVersion, requirements.minPodmanDesktopVersion)) {
      issues.push({
        type: 'incompatible-version',
        title: 'Incompatible with this Podman Desktop version',
        detail: podmanDesktopVersion
          ? `${extension.displayName} requires Podman Desktop v${requirements.minPodmanDesktopVersion} or later. You are running v${podmanDesktopVersion}.`
          : `${extension.displayName} requires Podman Desktop v${requirements.minPodmanDesktopVersion} or later.`,
        fix: `Upgrade Podman Desktop to v${requirements.minPodmanDesktopVersion} or later.`,
      });
    }
  }

  if (requirements.dependencies?.length) {
    const installedIds = new Set(installedExtensions.map(item => item.id));
    for (const dependency of requirements.dependencies) {
      if (dependency.required && shouldReportMissingDependency(extension.id, dependency.id, installedIds)) {
        issues.push({
          type: 'missing-dependency',
          title: 'Missing required extension',
          detail: `${extension.displayName} requires the ${dependency.displayName} extension to be installed first.`,
          fix: `Install the ${dependency.displayName} extension from the catalog.`,
        });
      }
    }
  }

  return issues;
}

export function hasExtensionCompatibilityIssues(
  extension: Pick<CatalogExtensionInfoUI, 'id' | 'displayName' | 'isInstalled'>,
  installedExtensions: CombinedExtensionInfoUI[],
  podmanDesktopVersion?: string,
): boolean {
  return resolveExtensionCompatibilityIssues(extension, installedExtensions, podmanDesktopVersion).length > 0;
}
