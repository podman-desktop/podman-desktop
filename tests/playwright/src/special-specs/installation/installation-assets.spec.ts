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

import { readFileSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

import defaultAssets from '/@/model/core/installation-assets.json' with { type: 'json' };
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  findInstallationAssets,
  getInstallationPaths,
  getRemoteExtensionAssets,
  type InstalledProduct,
  isAssetExpected,
  parseInstallationAssets,
} from '/@/utility/installation-assets';

// Load rules during discovery so each asset has its own test case in reports.
const input: unknown = process.env.TEST_INSTALLATION_ASSETS
  ? // eslint-disable-next-line n/no-sync
    JSON.parse(readFileSync(process.env.TEST_INSTALLATION_ASSETS, 'utf-8'))
  : defaultAssets;
const binary = process.env.PODMAN_DESKTOP_BINARY ? path.resolve(process.env.PODMAN_DESKTOP_BINARY) : undefined;
const roots = binary ? getInstallationPaths(binary, process.platform) : undefined;
// Installed metadata is needed during discovery to name each remote-extension test.
const product: InstalledProduct | undefined = roots
  ? // eslint-disable-next-line n/no-sync
    JSON.parse(readFileSync(path.join(roots.resources, 'product.json'), 'utf-8'))
  : undefined;
const assets = [...parseInstallationAssets(input), ...(product ? getRemoteExtensionAssets(product) : [])].filter(
  asset =>
    asset.platforms.includes(process.platform) && (!asset.architectures || asset.architectures.includes(process.arch)),
);
if (assets.length === 0) {
  throw new Error(`No asset checks configured for ${process.platform}/${process.arch}`);
}

const isRedHatProduct = process.env.PRODUCT_TESTS === '1';
const airgap = process.env.TEST_AIRGAP_BUILD === 'true' || process.env.TEST_AIRGAP_BUILD === '1';

test.describe('Installed application assets', { tag: ['@installation-assets', '@update-install'] }, () => {
  test.skip(!process.env.PODMAN_DESKTOP_BINARY, 'Requires PODMAN_DESKTOP_BINARY pointing at an installed application');

  test.beforeAll(async () => {
    playExpect((await stat(binary!)).isFile(), `Application executable: ${binary}`).toBeTruthy();
    playExpect(product, 'Installed product.json must define product metadata').toBeDefined();
    playExpect(typeof product!.appId, 'Installed product.json must define appId').toBe('string');
    playExpect(product!.appId).not.toBe('');
    playExpect(typeof product!.name, 'Installed product.json must define name').toBe('string');
    playExpect(product!.name).not.toBe('');
  });

  for (const [index, asset] of assets.entries()) {
    const expected = isAssetExpected(asset, airgap, isRedHatProduct);
    const filename = asset.pattern.replaceAll('{arch}', process.arch);
    test(`${index + 1}. ${asset.name}: ${filename} (${expected ? 'present' : 'absent'})`, async () => {
      const expand = (value: string): string =>
        value
          .replaceAll('{arch}', process.arch)
          .replaceAll('{product.name}', product!.name)
          .replaceAll('{product.appId}', product!.appId);
      const directory = path.resolve(roots![asset.root], expand(asset.directory));
      const pattern = expand(asset.pattern);
      const files = await findInstallationAssets(directory, pattern);
      playExpect(files.length > 0, `${expected ? 'Expected' : 'Unexpected'} asset: ${directory}/${pattern}`).toBe(
        expected,
      );
    });
  }
});
