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

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readdir, realpath, stat } from 'node:fs/promises';
import path from 'node:path';

/** Read standard sha256sum output, selecting only the downloaded installer's entry. */
export function getInstallerChecksum(manifest: string, filename: string): string {
  let checksum: string | undefined;
  let entries = 0;
  for (const [index, line] of manifest.split(/\r?\n/).entries()) {
    if (!line.trim()) {
      continue;
    }
    const match = /^(\\?)([a-fA-F0-9]{64}) [ *](.+)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid SHA256 checksum entry at line ${index + 1}`);
    }
    entries++;
    if (match[1] && !/^(?:[^\\]|\\[\\nr])+$/.test(match[3])) {
      throw new Error(`Invalid SHA256 filename escape at line ${index + 1}`);
    }
    const name = match[1]
      ? match[3].replace(/\\(.)/g, (_, c: string) => (c === 'n' ? '\n' : c === 'r' ? '\r' : c))
      : match[3];
    const entryName = path.basename(name);
    if (entryName !== filename) {
      continue;
    }
    if (checksum !== undefined) {
      throw new Error(`Multiple SHA256 checksum entries for ${filename}`);
    }
    checksum = match[2].toLowerCase();
  }
  if (entries === 0) {
    throw new Error('SHA256 checksum manifest is empty');
  }
  if (checksum === undefined) {
    throw new Error(`No SHA256 checksum entry for ${filename}`);
  }
  return checksum;
}

/** Stream installers so hashing large artifacts does not load them into memory. */
export async function calculateInstallerChecksum(installerPath: string): Promise<string> {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(installerPath)) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

/** Select one installer or all regular files directly inside a download directory. */
export async function getInstallerPaths(installerPath: string, checksumPath: string): Promise<string[]> {
  const target = await stat(installerPath);
  if (target.isFile()) {
    return [installerPath];
  }
  if (!target.isDirectory()) {
    throw new Error(`Installer path must be a regular file or directory: ${installerPath}`);
  }
  const entries = await readdir(installerPath, { withFileTypes: true });
  const checksumRealPath = await realpath(checksumPath);
  const files = entries.filter(entry => entry.isFile()).map(entry => path.join(installerPath, entry.name));
  const installers = (await Promise.all(files.map(async file => ({ file, real: await realpath(file) }))))
    .filter(({ real }) => real !== checksumRealPath)
    .map(({ file }) => file)
    .toSorted((a, b) => a.localeCompare(b));
  if (installers.length === 0) {
    throw new Error(`No installer files found in ${installerPath}`);
  }
  return installers;
}
