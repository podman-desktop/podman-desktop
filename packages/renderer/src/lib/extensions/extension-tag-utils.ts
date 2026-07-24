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

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isBuiltInExtension } from './extension-origin-utils';

export function resolveExtensionCategoryTags(categories: string[]): string[] {
  return categories.filter(category => category.trim().length > 0);
}

export function resolveExtensionTagsSortLabel(extension: CatalogExtensionInfoUI): string {
  const category = resolveExtensionCategoryTags(extension.categories)[0];
  if (category) {
    return category;
  }

  const installed = extension.installedExtension;
  if (installed?.type === 'dd') {
    return 'Docker Desktop extension';
  }
  if (installed?.devMode) {
    return 'DevMode extension';
  }
  if (installed && isBuiltInExtension(installed)) {
    return 'Built-in extension';
  }
  if (extension.isFeatured) {
    return 'Featured';
  }

  return '';
}

export function collectCatalogCategories(extensions: CatalogExtensionInfoUI[]): string[] {
  const categories = new Set<string>();
  for (const extension of extensions) {
    for (const category of resolveExtensionCategoryTags(extension.categories)) {
      categories.add(category);
    }
  }
  return [...categories].sort((a, b) => a.localeCompare(b));
}
