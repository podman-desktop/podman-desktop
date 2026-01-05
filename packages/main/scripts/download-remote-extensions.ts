/*********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 ********************************************************************/
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';

import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';

import minimist from 'minimist';

import type { ApiSenderType } from '/@/plugin/api.js';
import type { Certificates } from '/@/plugin/certificates.js';
import { ImageRegistry } from '/@/plugin/image-registry.js';
import type { Proxy } from '/@/plugin/proxy.js';
import type { Telemetry } from '/@/plugin/telemetry/telemetry.js';
import product from '/@product.json' with { type: 'json' };

/**
 * We create _dummy_ classes for the constructor of ImageRegistry
 * We do not use those classes when calling ImageRegistry#downloadAndExtractImage as the internal logic
 * uses different node_modules; those classes are needed for other things the class is doing
 */
const dummyApiSenderType = {} as unknown as ApiSenderType;
const dummyTelemetry = {} as unknown as Telemetry;
const dummyCertificate = {
  getAllCertificates: (): undefined => undefined,
} as unknown as Certificates;
const dummyProxy = {
  onDidUpdateProxy: (): void => {},
  onDidStateChange: (): void => {},
  isEnabled: (): boolean => false,
} as unknown as Proxy;

export interface RemoteExtension {
  name: string;
  oci: string;
}

export const OCI_ARG = 'oci';
export const NAME_ARG = 'name';

export const DIGEST_FILENAME = '.digest';

async function findExtensionDigest(extension: string): Promise<string | undefined> {
  try {
    return await readFile(join(extension, DIGEST_FILENAME), { encoding: 'utf-8' });
  } catch (_: unknown) {
    return undefined;
  }
}

export async function downloadExtension(destination: string, info: RemoteExtension): Promise<void> {
  const imageRegistry = new ImageRegistry(dummyApiSenderType, dummyTelemetry, dummyCertificate, dummyProxy);

  // tmp folder
  const tmpFolderPath = join(tmpdir(), info.name);

  const finalPath = join(destination, info.name);

  const { config } = await imageRegistry.getManifestFromImageName(info.oci);
  if (!config) {
    throw new Error(
      `extension ${info.name} has malformed content: the OCI image manifest should contains a "config" field`,
    );
  }
  if (!config.digest) {
    throw new Error(
      `extension ${info.name} has malformed content: the OCI image manifest should contains a "config.digest" field`,
    );
  }

  // check if the extension is already downloaded
  if (existsSync(finalPath)) {
    const existingDigest = await findExtensionDigest(finalPath);
    if (existingDigest === config.digest) {
      console.log(`cache hit for ${info.name} ${config.digest.substring(0, 18)}`);
      return;
    } else {
      console.log(`invalid digest for ${info.name}, cleanup ${finalPath}`);
      await rm(finalPath, { recursive: true });
    }
  }

  await imageRegistry.downloadAndExtractImage(info.oci, tmpFolderPath, console.log);

  if (!existsSync(join(tmpFolderPath, 'extension', 'package.json'))) {
    throw new Error(
      `extension ${info.name} has malformed content: the OCI image should contains a "package.json" file in the extension folder`,
    );
  }

  // ensure the destination directory exists
  await mkdir(destination, { recursive: true });

  // rename tmp to destination
  await moveSafely(join(tmpFolderPath, 'extension'), finalPath);
  await writeFile(join(finalPath, DIGEST_FILENAME), config.digest, { encoding: 'utf-8' });
}

/**
 * On a platform where the tmpdir is not on the same device as the destination
 * the rename will fail
 */
export async function moveSafely(src: string, dest: string): Promise<void> {
  try {
    await rename(src, dest);
  } catch (error: unknown) {
    if (!error || typeof error !== 'object' || !('code' in error)) {
      throw error;
    }

    if (error.code !== 'EXDEV') {
      throw error;
    }

    await cp(src, dest, { recursive: true });
    await rm(src, { recursive: true });
  }
}

export function getRemoteExtensionFromProductJSON(): RemoteExtension[] {
  if (!product) return [];
  if (!('extensions' in product) || !product.extensions || typeof product.extensions !== 'object') return [];
  if (!('remote' in product.extensions) || !product.extensions.remote || !Array.isArray(product.extensions.remote))
    return [];
  return product.extensions.remote as RemoteExtension[];
}

/**
 * Parsing the args provided
 * the `--output` is mandatory and should be an absolute path
 * the `--oci` and `--name` are optional but should be both defined if specified
 */
export function parseArgs(args: string[]): { output: string; extension?: RemoteExtension } {
  const parsed = minimist(args);

  const output: string | undefined = parsed['output'];
  if (!output) throw new Error('missing output argument');

  if (!isAbsolute(output)) throw new Error('the output should be an absolute directory');

  const oci = parsed[OCI_ARG];
  const name = parsed[NAME_ARG];

  // if --oci and --name are not provided, return the output directory as the extension directory
  if (!oci && !name) {
    return { output };
  }

  if (!oci || !name) {
    throw new Error(`when specifying --${OCI_ARG} or --${NAME_ARG}, both should be provided as valid string`);
  }

  if (Array.isArray(oci) || Array.isArray(name)) {
    throw new Error(`when specifying --${OCI_ARG} and --${NAME_ARG}, only one is allowed`);
  }

  if (typeof oci !== 'string' || typeof name !== 'string') {
    throw new Error(`when specifying --${OCI_ARG} and --${NAME_ARG}, should be valid strings`);
  }

  return {
    output,
    extension: { oci, name },
  };
}

export async function main(args: string[]): Promise<void> {
  const { output, extension } = parseArgs(args);

  // if an extension has been provided through CLI download it directly
  if (extension) {
    return downloadExtension(output, extension);
  }

  // otherwise fallback to bundled product.json
  await Promise.all(getRemoteExtensionFromProductJSON().map(downloadExtension.bind(undefined, output))).catch(
    console.error,
  );
}

// do not start if we are in a VITEST env
if (!process.env['VITEST']) {
  main(process.argv.slice(2)).catch(console.error);
}
