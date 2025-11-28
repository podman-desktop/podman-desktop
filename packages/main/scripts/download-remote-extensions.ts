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
import { rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import minimist from 'minimist';

import type { ApiSenderType } from '/@/plugin/api.js';
import type { Certificates } from '/@/plugin/certificates.js';
import { ImageRegistry } from '/@/plugin/image-registry.js';
import type { Proxy } from '/@/plugin/proxy.js';
import type { Telemetry } from '/@/plugin/telemetry/telemetry.js';

import product from '../../../product.json' with { type: 'json' };

const apiSenderTypeMock = {} as unknown as ApiSenderType;
const telemetryMock = {} as unknown as Telemetry;
const certificateMock = {
  getAllCertificates: (): undefined => undefined,
} as unknown as Certificates;
const proxyMock = {
  onDidUpdateProxy: (): void => {},
  onDidStateChange: (): void => {},
  isEnabled: (): boolean => false,
} as unknown as Proxy;

export interface RemoteExtension {
  name: string;
  oci: string;
}

export async function downloadExtension(destination: string, info: RemoteExtension): Promise<void> {
  const imageRegistry = new ImageRegistry(apiSenderTypeMock, telemetryMock, certificateMock, proxyMock);

  // tmp folder
  const tmpFolderPath = join(tmpdir(), info.name);

  const finalPath = join(destination, info.name);

  await imageRegistry.downloadAndExtractImage(info.oci, tmpFolderPath, console.log);

  if (!existsSync(join(tmpFolderPath, 'extension'))) {
    throw new Error(
      `extension ${info.name} has malformed content: the OCI image should contains an "extension" folder`,
    );
  }

  if (!existsSync(join(tmpFolderPath, 'extension', 'package.json'))) {
    throw new Error(
      `extension ${info.name} has malformed content: the OCI image should contains a "package.json" file in the extension folder`,
    );
  }

  await rename(join(tmpFolderPath, 'extension'), finalPath);
}

export async function main(args: string[]): Promise<void> {
  const parsed = minimist(args);

  const output: string | undefined = parsed['output'];
  if (!output) throw new Error('missing output argument');

  await Promise.all((product.remoteExtensions ?? []).map(downloadExtension.bind(undefined, output))).catch(
    console.error,
  );
}

// do not start if we are in a VITEST env
if (!process.env['VITEST']) {
  main(process.argv.slice(2)).catch(console.error);
}
