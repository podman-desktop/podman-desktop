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

import { readdir } from 'node:fs/promises';
import path from 'node:path';

export interface InstallationAsset {
  name: string;
  platforms: string[];
  architectures?: string[];
  root: 'resources' | 'application';
  directory: string;
  pattern: string;
  presence: 'present' | 'absent' | 'airgap' | 'redhat';
}

export interface InstalledProduct {
  appId: string;
  name: string;
  extensions?: { remote?: { name: string; oci: string }[] };
}

/** Remote extensions are extracted into resources/extensions-extra/<name>. */
export function getRemoteExtensionAssets(product: InstalledProduct): InstallationAsset[] {
  const remote = product.extensions?.remote;
  if (remote === undefined) {
    return [];
  }
  if (!Array.isArray(remote)) {
    throw new Error('Installed product.json extensions.remote must be an array');
  }
  return remote.map((extension, index) => {
    if (!extension || typeof extension.name !== 'string' || !extension.name || typeof extension.oci !== 'string') {
      throw new Error(`Invalid installed product.json remote extension at index ${index}`);
    }
    return {
      name: `Preinstalled remote extension: ${extension.name}`,
      platforms: ['darwin', 'win32', 'linux'],
      root: 'resources',
      directory: `extensions-extra/${extension.name}`,
      pattern: 'package.json',
      presence: 'present',
    };
  });
}

export function getInstallationPaths(binary: string, platform: string): { resources: string; application: string } {
  const paths = platform === 'win32' ? path.win32 : path.posix;
  const application = paths.resolve(paths.dirname(binary), ...(platform === 'darwin' ? ['..'] : []));
  return {
    application,
    resources: paths.join(application, platform === 'darwin' ? 'Resources' : 'resources'),
  };
}

export function parseInstallationAssets(value: unknown): InstallationAsset[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('Installation asset input must be a non-empty JSON array');
  }
  for (const [index, asset] of value.entries()) {
    if (
      !asset ||
      typeof asset !== 'object' ||
      typeof asset.name !== 'string' ||
      !asset.name ||
      !Array.isArray(asset.platforms) ||
      asset.platforms.length === 0 ||
      !asset.platforms.every(
        (platform: unknown) => typeof platform === 'string' && ['darwin', 'win32', 'linux'].includes(platform),
      ) ||
      (asset.architectures !== undefined &&
        (!Array.isArray(asset.architectures) ||
          asset.architectures.length === 0 ||
          !asset.architectures.every(
            (arch: unknown) => typeof arch === 'string' && ['x64', 'arm64'].includes(arch),
          ))) ||
      !['resources', 'application'].includes(asset.root) ||
      typeof asset.directory !== 'string' ||
      typeof asset.pattern !== 'string' ||
      !asset.pattern ||
      !['present', 'absent', 'airgap', 'redhat'].includes(asset.presence)
    ) {
      throw new Error(`Invalid installation asset at index ${index}`);
    }
  }
  return value as InstallationAsset[];
}

export function isAssetExpected(asset: InstallationAsset, airgap: boolean, isRedHatProduct: boolean): boolean {
  switch (asset.presence) {
    case 'present':
      return true;
    case 'absent':
      return false;
    case 'airgap':
      return airgap;
    case 'redhat':
      return isRedHatProduct;
  }
}

/** Match regular files only; an absent directory means no matching assets. */
export async function findInstallationAssets(directory: string, pattern: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.filter(entry => entry.isFile() && path.matchesGlob(entry.name, pattern)).map(entry => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
