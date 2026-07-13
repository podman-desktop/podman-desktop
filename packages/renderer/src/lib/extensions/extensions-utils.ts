/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { CatalogExtension } from '@podman-desktop/core-api/extension-catalog';
import type { FeaturedExtension } from '@podman-desktop/core-api/featured';

import { SearchTermParser } from '/@/lib/search/search-term-parser';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI, CatalogListFilters } from './catalog-extension-info-ui';
import type { ExtensionDetailsUI } from './extension-details-ui';
import { extensionRequiresManualUpdate } from './extension-onboarding-utils';
import { resolveExtensionVerificationStatus, shouldShowBuiltInNameIndicator } from './extension-origin-utils';
import { isPrototypeInstalledDemo } from './extension-prototype-installed-demos';
import {
  applyPrototypeCatalogUseCaseOverlay,
  applyPrototypeUseCaseOverlays,
  bumpPrototypePatchVersion,
  getPrototypeUpdateTargetVersion,
  isPrototypeUpdateDemoExtension,
  PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS,
} from './extension-prototype-use-cases';
import { withDisplayInstalledVersion } from './extension-version-update.svelte';
import type { InstalledListFilters } from './installed-list-filters.svelte';

export class ExtensionsUtils {
  findMatchingInstalledExtension(
    catalogExtension: Pick<CatalogExtension, 'id' | 'extensionName'>,
    installedExtensions: CombinedExtensionInfoUI[],
  ): CombinedExtensionInfoUI | undefined {
    return installedExtensions.find(installedExtension => {
      if (installedExtension.id === catalogExtension.id) {
        return true;
      }

      if (installedExtension.name === catalogExtension.extensionName) {
        return true;
      }

      if (installedExtension.id.endsWith(`.${catalogExtension.extensionName}`)) {
        return true;
      }

      return catalogExtension.id.endsWith(`.${installedExtension.name}`);
    });
  }

  findMatchingCatalogExtension(
    installed: CombinedExtensionInfoUI,
    catalogExtensions: CatalogExtension[],
  ): CatalogExtension | undefined {
    return catalogExtensions.find(
      catalogExtension =>
        catalogExtension.id === installed.id ||
        catalogExtension.extensionName === installed.name ||
        installed.id.endsWith(`.${catalogExtension.extensionName}`),
    );
  }

  findInstalledExtensionById(
    extensionId: string,
    installedExtensions: CombinedExtensionInfoUI[],
    catalogExtensions: CatalogExtension[] = [],
  ): CombinedExtensionInfoUI | undefined {
    const direct = installedExtensions.find(extension => extension.id === extensionId);
    if (direct) {
      return direct;
    }

    const loose = installedExtensions.find(
      extension =>
        extension.name === extensionId ||
        extension.id.endsWith(`.${extensionId}`) ||
        extensionId.endsWith(`.${extension.name}`),
    );
    if (loose) {
      return loose;
    }

    const matchingCatalog = catalogExtensions.find(
      catalogExtension =>
        catalogExtension.id === extensionId ||
        catalogExtension.extensionName === extensionId ||
        catalogExtension.id.endsWith(`.${extensionId}`),
    );
    if (matchingCatalog) {
      return this.findMatchingInstalledExtension(matchingCatalog, installedExtensions);
    }

    return undefined;
  }

  findCatalogExtensionById(extensionId: string, catalogExtensions: CatalogExtension[]): CatalogExtension | undefined {
    return catalogExtensions.find(
      catalogExtension =>
        catalogExtension.id === extensionId ||
        catalogExtension.extensionName === extensionId ||
        catalogExtension.id.endsWith(`.${extensionId}`),
    );
  }

  resolveInstalledExtensionsForUi(
    installedExtensions: CombinedExtensionInfoUI[],
    catalogExtensions: CatalogExtension[],
    featuredExtensions: FeaturedExtension[],
    options?: { applyPrototypeUpdateDemo?: boolean },
  ): CombinedExtensionInfoUI[] {
    const catalogList = this.extractCatalogExtensions(catalogExtensions, featuredExtensions, installedExtensions);
    const enhancedCatalog = options?.applyPrototypeUpdateDemo
      ? this.ensurePrototypeUpdateDemo(catalogList)
      : catalogList;
    return this.mergeWithCatalogInstalledExtensions(installedExtensions, enhancedCatalog);
  }

  extractExtensionDetail(
    catalogExtensions: CatalogExtension[],
    installedExtensions: CombinedExtensionInfoUI[],
    extensionId: string,
  ): ExtensionDetailsUI | undefined {
    const matchingInstalledExtension = this.findInstalledExtensionById(
      extensionId,
      installedExtensions,
      catalogExtensions,
    );
    const matchingCatalogExtension =
      this.findCatalogExtensionById(extensionId, catalogExtensions) ??
      (matchingInstalledExtension
        ? this.findMatchingCatalogExtension(matchingInstalledExtension, catalogExtensions)
        : undefined);

    // not installed and not in the catalog, return undefined as it is not matching
    if (!matchingCatalogExtension && !matchingInstalledExtension) {
      return undefined;
    }

    const resolvedExtensionId = matchingCatalogExtension?.id ?? matchingInstalledExtension?.id ?? extensionId;

    let displayName: string;

    let description: string;

    let type: 'dd' | 'pd';

    let removable: boolean;
    let devMode: boolean;
    let state: string;
    let icon: undefined | string | { light: string; dark: string };
    let iconRef: undefined | string;
    let name: string;
    let readme: { content?: string; uri?: string } = {};

    const nonPreviewVersions = matchingCatalogExtension?.versions.filter(v => v.preview === false) ?? [];
    const latestVersion = nonPreviewVersions.length > 0 ? nonPreviewVersions[0] : undefined;
    const latestVersionNumber = latestVersion ? `v${latestVersion.version}` : '';
    const latestVersionOciLink = latestVersion ? latestVersion.ociUri : undefined;
    const latestVersionIcon = latestVersion ? latestVersion.files.find(f => f.assetType === 'icon')?.data : undefined;
    const latestVersionReadme = latestVersion
      ? latestVersion.files.find(f => f.assetType.toLowerCase() === 'readme')?.data
      : undefined;
    const lastUpdated = latestVersion?.lastUpdated;
    // grab first from installed extension
    if (matchingInstalledExtension) {
      displayName = matchingInstalledExtension.displayName;
      description = matchingInstalledExtension.description;
      type = matchingInstalledExtension.type;
      removable = matchingInstalledExtension.removable;
      devMode = matchingInstalledExtension.devMode;
      state = matchingInstalledExtension.state;
      icon = matchingInstalledExtension.icon;
      name = matchingInstalledExtension.name;
      readme.content = matchingInstalledExtension.readme;
    } else if (matchingCatalogExtension) {
      displayName = matchingCatalogExtension.displayName;
      description = matchingCatalogExtension.shortDescription;
      // catalog only includes Podman Desktop extensions
      type = 'pd';
      removable = true;
      devMode = false; // catalog extensions are not in dev mode
      state = 'downloadable';
      name = matchingCatalogExtension.extensionName;

      if (latestVersionReadme) {
        readme = { uri: latestVersionReadme };
      }

      if (latestVersionIcon) {
        iconRef = latestVersionIcon;
      }
    } else {
      displayName = 'Unknown';
      description = '';
      type = 'pd';
      removable = false;
      devMode = false;
      state = 'unknown';
      name = 'unknown';
    }

    let releaseDate: string = 'N/A';
    if (lastUpdated) {
      releaseDate = lastUpdated.toISOString().split('T')[0];
    }

    const publisherDisplayName = this.resolvePublisherDisplayName(
      matchingInstalledExtension,
      matchingCatalogExtension?.publisherDisplayName,
    );

    const categories: string[] = matchingCatalogExtension?.categories ?? [];
    const matchingInstalledExtensionVersion = matchingInstalledExtension?.version
      ? `v${matchingInstalledExtension.version}`
      : undefined;
    const version = matchingInstalledExtensionVersion ?? latestVersionNumber ?? 'N/A';

    const installedExtension = matchingInstalledExtension;
    const error = matchingInstalledExtension?.error;

    const fetchLink = latestVersionOciLink ?? '';
    const fetchVersion = latestVersion?.version ?? '';

    const fetchable = fetchLink.length > 0;

    const matchingExtension: ExtensionDetailsUI = {
      id: resolvedExtensionId,
      displayName,
      description,
      type,
      removable,
      devMode,
      state,
      icon,
      iconRef,
      name,
      readme,
      releaseDate,
      categories,
      publisherDisplayName,
      version,
      installedExtension,
      fetchable,
      fetchLink,
      fetchVersion,
      error,
    };
    return matchingExtension;
  }

  extractCatalogExtensions(
    catalogExtensions: CatalogExtension[],
    featuredExtensions: FeaturedExtension[],
    installedExtensions: CombinedExtensionInfoUI[],
  ): CatalogExtensionInfoUI[] {
    // filter out unlisted extensions
    const values: CatalogExtensionInfoUI[] = catalogExtensions
      .filter(e => !e.unlisted)
      .map(catalogExtension => {
        // grab latest version
        const nonPreviewVersions = catalogExtension.versions.filter(v => !v.preview);
        const latestVersion = nonPreviewVersions[0];
        const fetchLink = latestVersion?.ociUri;
        const fetchVersion = latestVersion?.version;
        const publisherDisplayName = catalogExtension.publisherDisplayName;

        // grab icon
        const icon = latestVersion?.files.find(f => f.assetType === 'icon');
        const installed = this.findMatchingInstalledExtension(catalogExtension, installedExtensions);
        const isInstalled = !!installed;
        const isFeatured = featuredExtensions.some(featuredExtension => featuredExtension.id === catalogExtension.id);

        const shortDescription = catalogExtension.shortDescription;
        const installedVersion = installed?.version ?? fetchVersion;
        const categories = catalogExtension.categories;
        const keywords = catalogExtension.keywords;
        const availableVersions = nonPreviewVersions.map(version => ({
          version: version.version,
          ociUri: version.ociUri,
          preview: version.preview,
          lastUpdated: version.lastUpdated,
        }));
        const hasUpdate = isInstalled && !!installedVersion && !!fetchVersion && installedVersion !== fetchVersion;
        const { isSupportedByRedHat, isVerified } = resolveExtensionVerificationStatus(
          publisherDisplayName,
          categories,
        );
        const repositoryUrl = `https://github.com/podman-desktop/extensions/tree/main/extensions/${catalogExtension.extensionName}`;

        return {
          id: catalogExtension.id,
          displayName: catalogExtension.displayName,
          isFeatured,
          fetchLink,
          fetchVersion,
          fetchable: fetchLink !== '',
          iconHref: icon?.data,
          publisherDisplayName,
          isInstalled,
          installedVersion,
          shortDescription,
          categories,
          keywords,
          availableVersions,
          hasUpdate,
          isVerified,
          isSupportedByRedHat,
          repositoryUrl,
          installedExtension: installed,
        };
      });

    // sort by isFeatured and then by name
    values.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) {
        return -1;
      }
      if (!a.isFeatured && b.isFeatured) {
        return 1;
      }
      return a.displayName.localeCompare(b.displayName);
    });
    return values;
  }

  resolvePublisherDisplayName(installed?: CombinedExtensionInfoUI, catalogPublisher?: string): string {
    if (catalogPublisher) {
      return catalogPublisher;
    }
    if (installed?.publisher) {
      if (installed.publisher.toLowerCase() === 'redhat') {
        return 'Red Hat';
      }
      return installed.publisher;
    }
    return 'Unknown';
  }

  resolveCatalogMetadataForInstalled(
    extension: CombinedExtensionInfoUI,
    catalogById: ReadonlyMap<string, CatalogExtensionInfoUI>,
  ): CatalogExtensionInfoUI | undefined {
    const direct = catalogById.get(extension.id);
    if (direct) {
      return direct;
    }

    for (const catalogExtension of catalogById.values()) {
      if (catalogExtension.installedExtension?.id === extension.id) {
        return catalogExtension;
      }
      if (catalogExtension.id === extension.id || catalogExtension.id.endsWith(`.${extension.name}`)) {
        return catalogExtension;
      }
    }

    return undefined;
  }

  mergeWithCatalogInstalledExtensions(
    installedExtensions: CombinedExtensionInfoUI[],
    catalogExtensions: CatalogExtensionInfoUI[],
  ): CombinedExtensionInfoUI[] {
    const merged = new Map<string, CombinedExtensionInfoUI>(
      installedExtensions.map(extension => [extension.id, extension]),
    );

    for (const catalogExtension of catalogExtensions) {
      if (!catalogExtension.isInstalled || !catalogExtension.installedExtension) {
        continue;
      }

      const installed = catalogExtension.installedExtension;
      if (merged.has(installed.id)) {
        continue;
      }

      const matching = this.findMatchingInstalledExtension(catalogExtension, Array.from(merged.values()));
      if (!matching) {
        merged.set(installed.id, installed);
      }
    }

    const values = Array.from(merged.values());
    values.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return values;
  }

  /**
   * Prototype helper (DTUX-2849): overlay display states on real installed extensions.
   */
  applyPrototypeUseCaseOverlays(extensions: CombinedExtensionInfoUI[]): CombinedExtensionInfoUI[] {
    return applyPrototypeUseCaseOverlays(extensions);
  }

  /** @deprecated Fake demo rows are no longer merged. Applies use-case overlays only. */
  mergePrototypeInstalledDemos(extensions: CombinedExtensionInfoUI[]): CombinedExtensionInfoUI[] {
    return this.applyPrototypeUseCaseOverlays(extensions);
  }

  /**
   * Prototype helper (DTUX-2849): ensure two installed extensions show an update
   * when no real version mismatch exists in catalog data.
   */
  ensurePrototypeUpdateDemo(extensions: CatalogExtensionInfoUI[]): CatalogExtensionInfoUI[] {
    let result = extensions.map(extension => {
      if (extension.isInstalled && isPrototypeUpdateDemoExtension(extension.id)) {
        return applyPrototypeCatalogUseCaseOverlay(extension);
      }
      return extension;
    });

    const countUpdates = (list: CatalogExtensionInfoUI[]): number =>
      list.filter(extension => extension.isInstalled && extension.hasUpdate).length;

    if (countUpdates(result) >= 2) {
      return result;
    }

    for (const demoId of PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS) {
      if (countUpdates(result) >= 2) {
        break;
      }

      result = result.map(extension => {
        if (extension.id !== demoId || !extension.isInstalled || extension.hasUpdate) {
          return extension;
        }
        return this.withPrototypeUpdate(applyPrototypeCatalogUseCaseOverlay(extension));
      });
    }

    if (countUpdates(result) >= 2) {
      return result;
    }

    for (let index = 0; index < result.length && countUpdates(result) < 2; index++) {
      const extension = result[index];
      if (!extension.isInstalled || extension.hasUpdate || isPrototypeInstalledDemo(extension.id)) {
        continue;
      }
      result[index] = this.withPrototypeUpdate(extension);
    }

    return result;
  }

  withPrototypeUpdate(extension: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
    const installedVersion = extension.installedVersion ?? extension.fetchVersion;
    const fetchVersion =
      extension.fetchVersion && extension.fetchVersion !== installedVersion
        ? extension.fetchVersion
        : isPrototypeUpdateDemoExtension(extension.id)
          ? getPrototypeUpdateTargetVersion(extension.id, installedVersion ?? '')
          : bumpPrototypePatchVersion(installedVersion ?? '');

    const availableVersions = [...extension.availableVersions];
    if (fetchVersion && !availableVersions.some(version => version.version === fetchVersion)) {
      availableVersions.unshift({
        version: fetchVersion,
        ociUri: extension.fetchLink ?? '',
        preview: false,
      });
    }

    return {
      ...extension,
      hasUpdate: true,
      installedVersion,
      fetchVersion,
      availableVersions,
    };
  }

  buildCatalogInfoForInstalled(
    installed: CombinedExtensionInfoUI,
    catalogExtensions: CatalogExtension[],
    featuredExtensions: FeaturedExtension[] = [],
  ): CatalogExtensionInfoUI {
    const matchingCatalog = this.findMatchingCatalogExtension(installed, catalogExtensions);
    if (matchingCatalog) {
      const [catalogInfo] = this.extractCatalogExtensions([matchingCatalog], featuredExtensions, [installed]);
      return applyPrototypeCatalogUseCaseOverlay(catalogInfo);
    }

    const publisherDisplayName = this.resolvePublisherDisplayName(installed, matchingCatalog?.publisherDisplayName);
    const { isSupportedByRedHat, isVerified } = resolveExtensionVerificationStatus(
      publisherDisplayName,
      matchingCatalog?.categories ?? [],
    );
    const isFeatured = featuredExtensions.some(
      featuredExtension =>
        featuredExtension.id === installed.id ||
        featuredExtension.id.endsWith(`.${installed.name}`) ||
        installed.id.endsWith(`.${featuredExtension.id.split('.').pop() ?? ''}`),
    );

    const baseInfo: CatalogExtensionInfoUI = {
      id: installed.id,
      displayName: installed.displayName?.trim() ? installed.displayName : installed.name,
      isFeatured,
      fetchable: false,
      fetchLink: '',
      fetchVersion: installed.version ?? '',
      iconHref: typeof installed.icon === 'string' ? installed.icon : undefined,
      publisherDisplayName,
      isInstalled: true,
      installedVersion: installed.version,
      shortDescription: installed.description,
      categories: matchingCatalog?.categories ?? [],
      keywords: matchingCatalog?.keywords ?? [],
      availableVersions: installed.version ? [{ version: installed.version, ociUri: '', preview: false }] : [],
      hasUpdate: false,
      isVerified,
      isSupportedByRedHat,
      repositoryUrl: `https://github.com/podman-desktop/extensions/tree/main/extensions/${installed.id}`,
      installedExtension: installed,
    };

    if (isPrototypeInstalledDemo(installed.id)) {
      return baseInfo;
    }

    return applyPrototypeCatalogUseCaseOverlay(baseInfo);
  }

  buildCatalogExtensionInfoForId(
    extensionId: string,
    catalogExtensions: CatalogExtension[],
    featuredExtensions: FeaturedExtension[],
    installedExtensions: CombinedExtensionInfoUI[],
  ): CatalogExtensionInfoUI | undefined {
    const matchingCatalog = catalogExtensions.find(
      catalogExtension =>
        catalogExtension.id === extensionId ||
        catalogExtension.extensionName === extensionId ||
        catalogExtension.id.endsWith(`.${extensionId}`),
    );
    const installed = installedExtensions.find(
      extension =>
        extension.id === extensionId || extension.name === extensionId || extension.id.endsWith(`.${extensionId}`),
    );

    if (!matchingCatalog && !installed) {
      return undefined;
    }

    let catalogInfo: CatalogExtensionInfoUI;
    if (matchingCatalog) {
      [catalogInfo] = this.extractCatalogExtensions([matchingCatalog], featuredExtensions, installedExtensions);
    } else {
      catalogInfo = this.buildCatalogInfoForInstalled(installed!, catalogExtensions, featuredExtensions);
    }

    return applyPrototypeCatalogUseCaseOverlay(catalogInfo);
  }

  filterInstalledExtensions(
    extensions: CombinedExtensionInfoUI[],
    searchTerm: string,
    listFilters: InstalledListFilters = {},
    catalogById: ReadonlyMap<string, CatalogExtensionInfoUI> = new Map(),
  ): CombinedExtensionInfoUI[] {
    const parsed = new SearchTermParser(searchTerm, ExtensionsUtils.CATALOG_FILTERS);
    const searchTerms = parsed.terms.map(term => term.toLowerCase());
    const categoryFilter = listFilters.category?.toLowerCase();

    return extensions.filter(extension => {
      const catalogExtension = this.resolveCatalogMetadataForInstalled(extension, catalogById);
      const matchesSearch =
        searchTerms.length === 0 ||
        searchTerms.every(term =>
          `${extension.displayName} ${extension.description} ${extension.name} ${extension.id}`
            .toLowerCase()
            .includes(term),
        );

      if (!matchesSearch) {
        return false;
      }

      if (listFilters.verified === true) {
        if (catalogExtension && !catalogExtension.isVerified) {
          return false;
        }
      }

      if (listFilters.hasUpdate === true) {
        if (!catalogExtension || !extensionRequiresManualUpdate(withDisplayInstalledVersion(catalogExtension))) {
          return false;
        }
      }

      if (listFilters.featured === true) {
        if (catalogExtension && !catalogExtension.isFeatured) {
          return false;
        }
      }

      if (listFilters.builtIn === true) {
        if (!shouldShowBuiltInNameIndicator(extension, catalogExtension?.fetchable === true)) {
          return false;
        }
      }

      if (categoryFilter !== undefined) {
        if (
          catalogExtension &&
          !catalogExtension.categories.some(category => category.toLowerCase() === categoryFilter)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  static readonly CATALOG_FILTERS = ['category', 'keyword', 'is', 'not'] as const;

  filterCatalogExtensions(
    extensions: CatalogExtensionInfoUI[],
    searchTerm: string,
    listFilters: CatalogListFilters = {},
  ): CatalogExtensionInfoUI[] {
    const parsed = new SearchTermParser(searchTerm, ExtensionsUtils.CATALOG_FILTERS);
    const terms = parsed.terms;
    const categories = parsed.getFilter('category');
    const keywords = parsed.getFilter('keyword');
    const isValues = parsed.getFilter('is');
    const notValues = parsed.getFilter('not');
    const installedFromSearch = isValues.includes('installed')
      ? true
      : notValues.includes('installed')
        ? false
        : undefined;
    const installed = listFilters.installed ?? installedFromSearch;
    const categoryFilter = listFilters.category?.toLowerCase();

    return extensions.filter(extension => {
      return (
        (terms.length === 0 ||
          terms.every(term =>
            `${extension.displayName} ${extension.shortDescription}`.toLowerCase().includes(term.toLowerCase()),
          )) &&
        (categories.length === 0 ||
          categories.every(category => extension.categories.map(c => c.toLowerCase()).includes(category))) &&
        (keywords.length === 0 ||
          keywords.every(keyword => extension.keywords.map(k => k.toLowerCase()).includes(keyword))) &&
        (installed === undefined || installed === extension.isInstalled) &&
        (listFilters.verified !== true || extension.isVerified) &&
        (listFilters.hasUpdate !== true || extension.hasUpdate) &&
        (listFilters.featured !== true || extension.isFeatured) &&
        (categoryFilter === undefined ||
          extension.categories.some(category => category.toLowerCase() === categoryFilter))
      );
    });
  }
}
