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

import { readFile } from 'node:fs/promises';
import { arch, platform } from 'node:os';

import { injectable } from 'inversify';

import { ExtensionManifestSchema, type ExtensionPlatform } from '/@/plugin/extension/extension-manifest-schema.js';

/**
 * The platforms an extension can be installed on.
 *
 * `unrestricted` when the extension does not declare any platform,
 * `invalid` when the declaration cannot be understood and must refuse the installation.
 */
export type DeclaredPlatforms =
  | { readonly kind: 'unrestricted' }
  | { readonly kind: 'restricted'; readonly platforms: ExtensionPlatform[] }
  | { readonly kind: 'invalid' };

@injectable()
export class ExtensionPlatformService {
  /**
   * Node.js operating system names (`os.platform()`) to OCI operating system names.
   *
   * Only the operating systems Podman Desktop is built for are listed. Any other value is reported
   * as unknown, and an unknown platform never prevents an installation.
   */
  protected readonly osMappings: Record<string, string> = {
    darwin: 'darwin',
    linux: 'linux',
    win32: 'windows',
  };

  /**
   * Node.js architecture names (`os.arch()`) to OCI architecture names.
   *
   * Only the architectures Podman Desktop is built for are listed, see the `arch` targets of
   * `.electron-builder.config.cjs`. Any other value is reported as unknown, and an unknown platform
   * never prevents an installation.
   */
  protected readonly archMappings: Record<string, string> = {
    arm64: 'arm64',
    x64: 'amd64',
  };

  // reuse the extension manifest schema so the runtime check and schemas/extension-schema.json cannot disagree
  protected readonly targetPlatformsSchema = ExtensionManifestSchema.pick({ targetPlatforms: true });

  /**
   * Convert a Node.js platform/architecture pair to an `os/architecture` platform identifier.
   *
   * @returns undefined when the pair cannot be expressed as an extension platform
   */
  toExtensionPlatform(nodePlatform: string, nodeArch: string): ExtensionPlatform | undefined {
    const operatingSystem = this.osMappings[nodePlatform];
    const architecture = this.archMappings[nodeArch];
    if (!operatingSystem || !architecture) {
      return undefined;
    }
    return `${operatingSystem}/${architecture}`;
  }

  /**
   * @returns undefined when the platform of the host cannot be expressed as an extension platform
   */
  getCurrentPlatform(): ExtensionPlatform | undefined {
    return this.toExtensionPlatform(platform(), arch());
  }

  /**
   * Check that the current platform is declared.
   *
   * An unknown host platform is never rejected.
   */
  isSupported(
    declaredPlatforms: readonly ExtensionPlatform[],
    currentPlatform: ExtensionPlatform | undefined,
  ): boolean {
    if (!currentPlatform) {
      return true;
    }
    return declaredPlatforms.includes(currentPlatform);
  }

  /**
   * Read the platforms declared by an extension manifest, before the extension is copied to the plugins directory.
   *
   * A manifest which cannot be read or parsed is reported by the extension analysis, so it does not block the
   * installation here. A `targetPlatforms` value which cannot be understood is reported as `invalid` so the
   * installation is refused rather than installing an extension on a platform it does not support.
   */
  async readDeclaredPlatforms(manifestPath: string): Promise<DeclaredPlatforms> {
    let manifest: unknown;
    try {
      manifest = JSON.parse(await readFile(manifestPath, { encoding: 'utf-8' }));
    } catch (error: unknown) {
      console.debug(`Unable to read the platforms declared by extension ${manifestPath}: ${String(error)}`);
      return { kind: 'unrestricted' };
    }

    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
      return { kind: 'unrestricted' };
    }

    const result = this.targetPlatformsSchema.safeParse(manifest);
    if (!result.success) {
      return { kind: 'invalid' };
    }

    const platforms = result.data.targetPlatforms;
    return platforms ? { kind: 'restricted', platforms } : { kind: 'unrestricted' };
  }
}
