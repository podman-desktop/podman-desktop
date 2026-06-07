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

import type { ProviderInfo } from '@podman-desktop/core-api';
import { derived, get } from 'svelte/store';

import type { DeveloperSandboxPromptOverride } from '/@/lib/kube/developer-sandbox-prompt-prototype';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { activePrototype, currentOverride } from '/@/stores/prototype';
import { fetchProviders, providerInfos } from '/@/stores/providers';

import developerSandboxProviderIcon from './DeveloperSandboxProviderIcon.png';

/** Provider id registered by the Developer Sandbox extension on the Resources page. */
export const DEVELOPER_SANDBOX_PROVIDER_ID = 'redhat.sandbox';

export const DEVELOPER_SANDBOX_EXTENSION_ID = 'redhat.redhat-sandbox';

export const DEVELOPER_SANDBOX_PROTOTYPE_INTERNAL_ID = 'prototype-redhat-sandbox';

/** Empty-state copy shown on Settings > Resources, matching the Developer Sandbox extension. */
export const DEVELOPER_SANDBOX_EMPTY_CONNECTION_MARKDOWN = `A free, private OpenShift environment including one project and a resource quota of 14 GB RAM, and 40 GB storage. It lasts 30 days.

Sign up at [https://developers.redhat.com/developer-sandbox](https://developers.redhat.com/developer-sandbox/?sc_cid=7013a000003SUmgAAG).`;

/** Matches the Recommended banner height on the Developer Sandbox card. */
export const kubernetesEmptyCardHeaderClass = 'min-h-6 shrink-0';

export function computeDeveloperSandboxPromptVisible(
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
  hasDeveloperSandboxConnection: boolean,
): boolean {
  const useLiveState = isPrototypeActive && prototypeOverride?.useLiveState === true;

  if (useLiveState) {
    return false;
  }

  if (isPrototypeActive) {
    return prototypeOverride?.showPrompt ?? false;
  }

  return !hasDeveloperSandboxConnection;
}

export function findDeveloperSandboxProvider(providers: ProviderInfo[]): ProviderInfo | undefined {
  return providers.find(
    provider =>
      provider.id === DEVELOPER_SANDBOX_PROVIDER_ID ||
      provider.id.includes('sandbox') ||
      provider.name.includes('Developer Sandbox'),
  );
}

export function getDeveloperSandboxConnectionPath(provider: ProviderInfo): string {
  return `/preferences/resources/provider/${provider.internalId}`;
}

export function getDeveloperSandboxResourcesPath(): string {
  return `/preferences/resources?focus=${DEVELOPER_SANDBOX_PROVIDER_ID}`;
}

export function isDeveloperSandboxExtensionInstalledForResources(
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
  installedExtensionIds: readonly string[],
): boolean {
  const liveInstalled = installedExtensionIds.includes(DEVELOPER_SANDBOX_EXTENSION_ID);

  if (!isPrototypeActive || prototypeOverride?.useLiveState) {
    return liveInstalled;
  }

  return liveInstalled || (prototypeOverride?.extensionInstalled ?? false);
}

export function shouldInjectDeveloperSandboxProviderForResources(
  providers: ProviderInfo[],
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
  installedExtensionIds: readonly string[],
): boolean {
  if (findDeveloperSandboxProvider(providers) !== undefined) {
    return false;
  }

  return isDeveloperSandboxExtensionInstalledForResources(prototypeOverride, isPrototypeActive, installedExtensionIds);
}

/** @deprecated Use {@link shouldInjectDeveloperSandboxProviderForResources} instead. */
export function shouldInjectPrototypeDeveloperSandboxProvider(
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
  providers: ProviderInfo[],
): boolean {
  return shouldInjectDeveloperSandboxProviderForResources(providers, prototypeOverride, isPrototypeActive, []);
}

function getDeveloperSandboxProviderIcon(): { dark: string; light: string } {
  return {
    dark: developerSandboxProviderIcon,
    light: developerSandboxProviderIcon,
  };
}

export function enrichDeveloperSandboxProviderForResources(provider: ProviderInfo): ProviderInfo {
  let emptyConnectionMarkdownDescription = DEVELOPER_SANDBOX_EMPTY_CONNECTION_MARKDOWN;
  const trimmedMarkdown = provider.emptyConnectionMarkdownDescription?.trim();
  if (trimmedMarkdown) {
    emptyConnectionMarkdownDescription = trimmedMarkdown;
  }
  return {
    ...provider,
    name: 'Developer Sandbox',
    emptyConnectionMarkdownDescription,
    images: {
      ...provider.images,
      icon:
        provider.images?.icon &&
        (typeof provider.images.icon === 'string'
          ? provider.images.icon.length > 0
          : provider.images.icon.dark || provider.images.icon.light)
          ? provider.images.icon
          : getDeveloperSandboxProviderIcon(),
    },
    kubernetesProviderConnectionCreation: provider.kubernetesProviderConnectionCreation ?? true,
    kubernetesProviderConnectionCreationDisplayName:
      provider.kubernetesProviderConnectionCreationDisplayName ?? 'Developer Sandbox',
    kubernetesProviderConnectionCreationButtonTitle:
      provider.kubernetesProviderConnectionCreationButtonTitle ?? 'Create new',
  };
}

export function createPrototypeDeveloperSandboxProvider(): ProviderInfo {
  return enrichDeveloperSandboxProviderForResources({
    id: DEVELOPER_SANDBOX_PROVIDER_ID,
    internalId: DEVELOPER_SANDBOX_PROTOTYPE_INTERNAL_ID,
    extensionId: DEVELOPER_SANDBOX_EXTENSION_ID,
    status: 'started',
    warnings: [],
    detectionChecks: [],
    installationSupport: false,
    containerConnections: [],
    kubernetesConnections: [],
    vmConnections: [],
    links: [],
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    kubernetesProviderConnectionInitialization: false,
    vmProviderConnectionCreation: false,
    vmProviderConnectionInitialization: false,
    cleanupSupport: false,
    canStart: false,
    canStop: false,
  } as ProviderInfo);
}

export async function resolveDeveloperSandboxProviderForCreate(provider: ProviderInfo): Promise<ProviderInfo> {
  if (provider.internalId !== DEVELOPER_SANDBOX_PROTOTYPE_INTERNAL_ID) {
    return provider;
  }

  await fetchProviders();
  return findDeveloperSandboxProvider(get(providerInfos)) ?? provider;
}

export function mergeDeveloperSandboxProvidersForResources(
  providers: ProviderInfo[],
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
  installedExtensionIds: readonly string[],
): ProviderInfo[] {
  const enrichedProviders = providers.map(provider =>
    findDeveloperSandboxProvider([provider]) ? enrichDeveloperSandboxProviderForResources(provider) : provider,
  );

  if (
    !shouldInjectDeveloperSandboxProviderForResources(
      enrichedProviders,
      prototypeOverride,
      isPrototypeActive,
      installedExtensionIds,
    )
  ) {
    return enrichedProviders;
  }

  return [...enrichedProviders, createPrototypeDeveloperSandboxProvider()];
}

/** @deprecated Use {@link mergeDeveloperSandboxProvidersForResources} instead. */
export function mergePrototypeDeveloperSandboxProviders(
  providers: ProviderInfo[],
  prototypeOverride: DeveloperSandboxPromptOverride | undefined,
  isPrototypeActive: boolean,
): ProviderInfo[] {
  return mergeDeveloperSandboxProvidersForResources(providers, prototypeOverride, isPrototypeActive, []);
}

export const resourcesProviderInfos = derived(
  [providerInfos, activePrototype, currentOverride, combinedInstalledExtensions],
  ([$providerInfos, $activePrototype, $currentOverride, $installedExtensions]) =>
    mergeDeveloperSandboxProvidersForResources(
      $providerInfos,
      $currentOverride as DeveloperSandboxPromptOverride | undefined,
      $activePrototype !== undefined,
      $installedExtensions.map(extension => extension.id),
    ),
);

function hasDeveloperSandboxConnection(providerInfosValue: ProviderInfo[]): boolean {
  return providerInfosValue.some(
    provider => findDeveloperSandboxProvider([provider]) !== undefined && provider.kubernetesConnections.length > 0,
  );
}

export const developerSandboxPromptVisible = derived(
  [activePrototype, currentOverride, providerInfos],
  ([$activePrototype, $currentOverride, $providerInfos]) =>
    computeDeveloperSandboxPromptVisible(
      $currentOverride as DeveloperSandboxPromptOverride | undefined,
      $activePrototype !== undefined,
      hasDeveloperSandboxConnection($providerInfos),
    ),
);
